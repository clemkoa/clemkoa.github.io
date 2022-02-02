---
layout: post
title: "Code signing process and artefacts"
subtitle: ""
date: 2022-01-31
categories: software
header-img: ""
---

I had to sign an electron package recently and got confused by the different artefacts required to sign some files.
I found out that there was little explanation about the process and it was hard to deeply understand why I needed to do some steps that I was doing.

So I'm writing this post in order to give some explanation about the process and what each artefact contains.


## What code signing does

When the user is about to run an executable, how can they trust it? It could come from anywhere on the internet.
How can you trust that the executable you downloaded from slack.com is actually coming from the company you think is Slack? There are plenty of attacks possible to give you a different executable to what you think you have.

Code signing, as it says in the name, is all about providing some proof of identity. 
It's about giving you an executable with a name on it and so that everyone can check where it comes from.
Code signing will not allow you to check whether the software is dangerous (it's not an antivirus) - it's simply checking that you are who you say you are.


## How does digital signature work?

### 1. Certificate chain of trust

Code signing is based on the Public Key Infrastructure (PKI). It's an infrastructure that defines processes to binds public keys with some level of identity (people and organisations). The binding process is done through a registration made by a certificate authority (CA). CAs are very important because they are trusted by most devices. 

There is a certificate chain of trust that links any certificate back to the root certificate of the CA that issued it. All CAs root certificates are installed on your computer by default - that's how you can install Chrome or Slack on your computer without adding a certificate coming from Google or Slack beforehand. It also means that if [any of the CA issuing processes gets compromised](https://en.wikipedia.org/wiki/DigiNotar), a lot of people are in trouble.

![Chain of trust](/assets/images/code_signing/Chain_Of_Trust.svg)

<center>
Each issued certificate references its issuer and can be verified. You go down the chain until the root certificate which is trusted because already installed on your machine.
</center>
<br/>

Ok so let's say you have your own digital certificate issued by a CA and you want to sign some files. How do you do it?

### 2. Digital signature

How to sign:
1. Apply a hash function on the files
2. Encrypt the hash with your private key
3. Add your certificate (public key) in the package

How to verify a signature:
1. Verify the certificate with the certificate chain of trust
2. Apply the hash function on the files
3. With the public key in the certificate, decrypt the signed hash that was bundled with the files
4. Check both hashes are equal

On top of that a timestamp is added during signing so that the signature stays valid even if the certificate has expired since the signature.

![Digital signature verification](/assets/images/code_signing/Private_key_signing.svg){:style="width:300px;display:block; margin-left:auto; margin-right:auto;"}
<center>Alice signs a message by adding the encrypted hash to the message. Bob verifies it with Alice's public key.</center><br/>

So now we know how the digital signature works, but there is one remaining question: how do you get a digital certificate?


## How do certificates get issued?


The first step of this process is to generate a pair of public and private keys. 
You can do that directly on your machine or on some specific hardware like [HSMs](https://en.wikipedia.org/wiki/Hardware_security_module). 
The important part is that your private key is never shared with anyone else and that it is kept in a safe environment.

The trick about issuing certificates is that you should never give your private key to anyone, including the Certificate Authority.
CAs work with [Certificate Signing Requests (CSR)](https://en.wikipedia.org/wiki/Certificate_signing_request). It's a message sent by the applicant to the regristration authory.
It contains:
- the public key for which the certificate should be issued
- identifying information (domain name, organisation name, email address etc...)

The CA will ask you to prove you are who you say you are at registration, usually by providing documents like bills or bank statements. This step is important and should limit the risk of impersonation.

Once you have your CSR, you send it to the CA and get a certificate back. 
The certificate is a .crt file that contains a digital signature from the CA, identifying information, the public key you sent in the CSR and other information like validity period, id, etc...

The certificate does not contain your private key, only the public one. So it's safe to share - and it is actually shared when signing files so that people can verify the signature.
You can then use your private key and this certificate to sign files and distribute them!

## Conclusion

Hopefully you know understand more about the code signing process. 
As you have seen, this relies heavily on the Public Key Infrastructure and the Certificate Chain of Trust from Certificate Authorities.
It's also a bit different to how encryption like [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security#Algorithms) works but that's a topic for next time. 

In the meantime we can appreciate that code signing is a pretty smart process that keeps things simple for users who install packages coming from anywhere on the web!
