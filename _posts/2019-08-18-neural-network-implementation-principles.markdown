---
layout: post
title: "Neural network implementation principles"
date: 2019-08-18
categories: dental
---

It’s easy to get lost or discouraged while implementing a neural net, especially from state-of-the-art papers. These models are complex, and I found myself stuck many times while trying to train one of them. Over time, I developed a few principles that help me implement neural net better and faster.

The type of task this post addresses is not fine-tuning a deep learning model to gain a few 0.1%, or build a production-ready end-to-end pipeline. It is more about trying to replicate a paper's results, based on a blurry definition of the model architecture.

Andrej Karpathy released an incredibly nice recipe for NN implementation a few months ago: [https://karpathy.github.io/2019/04/25/recipe/](https://karpathy.github.io/2019/04/25/recipe/). While his post is very thorough, I thought I would add a few big-picture principles and specify where my “recipe” differs from his.

## Principle 1. Reduce complexity.

This seems very simple and obvious. And it’s what we’re all trying to do every time right? Well, it's easier if you have a checklist to follow, one thing at a time. The goal here is to actively isolate problems and reduce complexity.

When it comes to implementing neural nets, here is my usual checklist:

#### 1. Focus on forward pass first

This will help define the architecture and layers, and having a clear idea of the output of the neural network. Some papers can seem blurry about the model architecture, and I believe starting with the forward pass helps setting a proper foundation for the implementation. You will have a clearer view of what the net does, and how the training works.

I also find that forcing myself to write an architecture skeleton raises some important questions early. It really helps understand the key points of the paper.
No need to get lost building the whole data pipeline when you don't have a clear vision of the model.

#### 2. Train by overfitting

Now you’re ready for back-propagation. While training, error sources are plenty: you can have issues in your dataset, your loss, or any mathematical operation you perform. You can have wrong parameters or initialisation that will prevent the network from learning properly. In order to reduce complexity, it’s important to focus on one thing at time. My plan is usually the following:

- Start with only 1 sample that you selected. If the training doesn’t converge, you have big issues. Validate the NN output on the same sample as the training one. This way your training set is also your evaluation set, and you can focus on initialisation and meta-parameters.
- Train with ~10 samples
- Train on whole dataset

By starting with only one sample, you reduce complexity coming from the dataset and the data pipeline. Overfitting on one sample will make you focus on the loss definition, back-propagation and initialisation. As soon as training converges on 1 sample, try with a dozen samples. This will introduce a bit of variety in the data distribution, as well as a stronger data pipeline. When the model works on a small subset, you can extend to the whole dataset and focus on the data pipeline aspect.

#### 3. Initialisation is key

Now that your network is able to train on the whole dataset and you can see the loss going down, it's time to help the learning process.
Sometimes the loss will be stuck around a specific value, and it feels like the network is not able to go past it.
Having a proper look at your network initialisation can save you a lot of time. Wrong initialisation values, too big or too small, can set you back for a while.
I recommend you have a go at [https://www.deeplearning.ai/ai-notes/initialization/](https://www.deeplearning.ai/ai-notes/initialization/) for a
very interesting playground.

## Principle 2. Reduce the potential error sources.

#### Mind your transformations

You should be wary of tensor reshaping. It is easy to use a `reshape` instead of a `permute`, and your network won't be able to train properly because you mixed up your data across dimensions. In general, you should be careful about any tensor reshaping!

#### Know you dataset

As Andrej Karpathy says, you need to become one with the data in order to understand what you are doing.

#### Visualize everything

You need to visualize inputs, outputs, training loss, middle layers and any variable that is important to your model. Tensorboard is great for this.

#### Test everything

NNs rely on mathematical functions and it’s easy to make a mistake / typo in big numpy one-liners. Testing everything will ensure:

- You have separated your code in dedicated and unitary functions
- Your functions do exactly what you want.
- You have more confidence in your code and can debug easier

In python, pytest is great for testing.

#### Reproducibility matters

Vanishing gradient is one of the problems for which it's nice to reproduce the issue.
Setting the random seed is a mandatory step for any model implementation: run it twice, get the same results.

#### Start with code readability instead of optimisation

You will gain time having a slower but easier to debug model at first. Once your model trains perfectly, you can spend some time on optimising every step.

## Principle 3. Most of the intelligence is in the definition of the loss.

The training loss and back-propagation are often the most complex steps in the implementation, because it’s where most of the intelligence comes from. It's worth spending some time on your loss definition!

Hope you find these simple principles useful for your future implementations.

---------
Edited on 2020-05-21
