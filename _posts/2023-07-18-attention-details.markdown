---
layout: post
title: "Attention in transformers"
subtitle: ""
date: 2023-07-18
categories: software
header-img: ""
---

An explanation of the implementation of attention in Transformers as described in ["Attention is all you need" by Vaswani et al](https://arxiv.org/abs/1706.03762).

## Introduction

Preface: This post will not introduce anything new at all but rather will try to explain what the Transformer attention mechanism is.

#### Transformers

In machine learning, a transformer refers to a type of deep learning model architecture that was introduced in the seminal paper "[Attention is all you need](https://arxiv.org/pdf/1706.03762.pdf)" by Vaswani et al. in 2017. The transformer architecture revolutionised various natural language processing (NLP) tasks and has since become a foundational building block in many state-of-the-art models.

#### Attention

As described in [Wikipedia](https://en.wikipedia.org/wiki/Attention_(machine_learning)),

> Attention is a technique that is meant to mimic cognitive attention. This effect enhances some parts of the input data while diminishing other parts—the motivation being that the network should devote more focus to the important parts of the data. Learning which part of the data is more important than another depends on the context, and this is trained by gradient descent. 

## The idea of attention

Attention is a general mechanism and can have many implementations, like the additive attention or the multiplicative attention. This post will focus on the multiplicative attention as it is the one used in transformers, described as *Scaled Dot-Product Attention*. Dot-product is a useful algebraic operation because it measures similarity between vectors.

Note: Attention can be used in a lot of different tasks, not only NLP. But for all the examples in this post we will use a NLP task. Let's assume we are using word-level tokens (which is rarely the case and generally [sub-word-level tokens](https://huggingface.co/docs/transformers/tokenizer_summary) are used). 

The raw sentence

```
Watch that bird
```

with embeddings, becomes


$$ [x_1, x_2, x_3] $$

For the sake of example, let's say we have an embedding space of dimension 4. Our embedding sequence looks something like:

![assets/images/attention/embeddings.png](/assets/images/attention/embeddings.png){: width="200" style="display:block; margin-left:auto; margin-right:auto" }
*<center>Figure 1. Embedding matrix X of the example sentence.</center>*



#### 1. Query, Key and Value.

The sequence of embedding vectors is split into 3 processing paths, that we call Query (`Q`), Key (`K`) and Values (`V`).
Each embedding vector, like $$ x_1 $$, produces 3 vectors:

![assets/images/attention/q1k1v1.png](/assets/images/attention/q1k1v1.png)
*<center>Figure 2. Query, Key and Value vectors for one word.</center>*

Note that the dimensions of $$ q_1 $$ and $$ k_1 $$ have to be the same - we call it $$d_k$$ - because of dot product, but it doesn't have to be the same as the embedding dimension. The dimension $$d_v$$ of $$ v_1 $$ has to be the dimension of the output, but we'll come back to that later. For the sake of simplicity, all dimensions are kept to 4 here, same as the embeddings.

![assets/images/attention/qkv.png](/assets/images/attention/qkv.png){: width="250" style="display:block; margin-left:auto; margin-right:auto" }
*<center>Figure 3. Q, K and V as matrices.</center>*

The terms key, query and value are taken from relational database systems / information retrieval and are possibly misleading.
We attribute the meaning of key query and values to them when the model might learn something different.
But the names are good to explain the intention of the architecture.

**How are those vectors obtained from our embeddings $$ x $$ ?**

These vectors are linear transformations of the input word embeddings, and they capture different aspects of the word's representation.
In practice it's a linear layer from the embeddings, one for each of Q, K and V.

#### 2. Similarity scores

`K` and `Q` will be used to make *soft weights* using [dot-product](https://en.wikipedia.org/wiki/Dot_product). Dot-product is used to measure similarity (or affinity) between vectors.
Dot-product is used to obtain similarity between `K` and `Q`. For vector $$x_1$$, the similarity $$s_{1,2}$$ with vector $$x_2$$ is

$$ s_{1,2} = q_1 \cdot k_2$$

$$s_{1,2}$$ is a scalar.

Which we can write with matrix multiplication using *transpose* as:

$$ \text{similarity} = Q K^T \\ $$

![assets/images/attention/similarity1.png](/assets/images/attention/similarity1.png){: width="500" style="display:block; margin-left:auto; margin-right:auto" }
*<center>Figure 4. Using matrix multiplication and transpose to parallelise dot-product.</center>*

The use of matrix multiplication and transpose for the dot-product operation is why the Scaled Dot-Product Attention is a type of multiplicative attention.

We then normalise the similarity:

$$\text{normalised_similarity} = \frac{Q K^T}{\sqrt{d_k}}  $$

where $$d_k$$ is the dimension of key and query vectors. We scale the matrix by the square root of $$d_k$$ before softmax in order to prevent one-hot-like vectors. If you have a vector with high variance, softmax will produce vectors that are very sharp and close to one-hot. As stated in the paper:
> We suspect that for large values of $$d_k$$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients

#### 3. Attention weights

Then we softmax to transform into probabilities.

$$ \text{soft_weights} = \text{softmax}(\frac{Q K^T}{\sqrt{d_k}}) $$

These attention weights represent how much each token should focus on the other tokens in the sequence.

#### 4. Weighted sum or context

From those soft weights and `V` we calculate the output, usually called *context*.

$$ \text{context} = \text{soft_weights} * V $$

$$ \text{context} = \text{softmax}(\frac{Q K^T}{\sqrt{d_k}}) V $$

![assets/images/attention/context.png](/assets/images/attention/context.png){: width="500" style="display:block; margin-left:auto; 
margin-right:auto" }
*<center>Figure 5. Last step of attention, context by multiplying soft_weights and V.</center>*

Here we see that the output *context* dimensions are (embedding_length, $$d_v$$) where $$d_v$$ is the dimension of V.
And that's how attention works in transformers!

## Self-attention

We usually call *self-attention* attention where K, Q and V are all computed from the same embeddings (same input).
Self-attention is used in text generation models, like ChatGPT, where the model uses the current sequence to generate the next token.

![assets/images/attention/self-attention.png](/assets/images/attention/self-attention.png){: width="400" style="display:block; margin-left:auto; margin-right:auto" }
*<center>Figure 6. Self-attention.</center>*



## Cross-attention

*Cross-attention* is attention where (K,Q) and V are computed from two separate inputs. K and Q are always computed on the same input, although obtained through different linear transformations.
Cross attention is used in translation tasks, where K and Q come from the input embedding and V comes from the translated text embedding.

![assets/images/attention/cross-attention.png](/assets/images/attention/cross-attention.png){: width="400" style="display:block; margin-left:auto; margin-right:auto" }
*<center>Figure 7. Cross-attention.</center>*



## Multi-head attention

Multi-head attention is a concept that is orthogonal to self-attention or cross-attention - it can be used in both cases.
In multi-head attention, we parallelise attention so that each head focuses on different aspects of the inputs relationship, allowing the model to capture diverse information from different perspectives. In the paper, authors say:

> We found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to dk, dk and dv dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding dv-dimensional output values. These are concatenated and once again projected, resulting in the final values

![assets/images/attention/multi-head-attention.png](/assets/images/attention/multi-head-attention.png){: width="250" style="display:block; margin-left:auto; 
margin-right:auto" }
*<center>Figure 8. Multi-head attention.</center>*

### Sources

- [Attention is all you need](https://arxiv.org/pdf/1706.03762.pdf) by Vaswani et al.
- Andrej Karpathy's brilliant explanation and implementation of transformers in his video on youtube: [https://www.youtube.com/watch?v=kCc8FmEb1nY](https://www.youtube.com/watch?v=kCc8FmEb1nY)
- [https://stats.stackexchange.com/questions/421935/what-exactly-are-keys-queries-and-values-in-attention-mechanisms](https://stats.stackexchange.com/questions/421935/what-exactly-are-keys-queries-and-values-in-attention-mechanisms)
- [https://en.wikipedia.org/wiki/Attention_(machine_learning)](https://en.wikipedia.org/wiki/Attention_(machine_learning))

<!-- -----------------------

Dot product between key and query. For each word, this will give us "soft weights": the importance or relevance of each word in the sentence to the word considered.
For instance, if we care about `that`, the soft weights in position 3 (for `bird`) would probably be quite high.

{% highlight python %}
[v1, v2, ..., v10]
{% endhighlight %}


- TODO here talk about the mask thing - to have backward only stuff for instance.


### bin

In a space of 2 (extreme example), our embeddings could be something like

```python
embeddings = array([[0.02233797, 0.96076952],
                    [0.33266813, 0.30613825],
                    [0.13648528, 0.47694412],
                    [0.08976483, 0.87595883]])

# where 
# v1 = [0.02233797, 0.96076952]
# v2 = [0.33266813, 0.30613825]
# etc...
```

-----------------------

Let's say we look at the word `that`, its 3 vectors could be:
``` python
query   -> [0.14578577, 0.99999999, 0.22955889]
key     -> [0.64928168, 0.97303592, 0.85099433]
value   -> [0.11995471, 0.60369085, 0.35594556]
```

Conceptually, we could think about
query -> what am i looking for
key -> what do i contain

the keys could be (extreme example)
```python
keys -> array([[0.37115594, 0.38805203, 0.85030176],
               [0.64928168, 0.97303592, 0.85099433],
               [0.00100000, 2.80000000, 0.50000000],
               [0.01331219, 0.14883285, 0.68920784]])
 -->
