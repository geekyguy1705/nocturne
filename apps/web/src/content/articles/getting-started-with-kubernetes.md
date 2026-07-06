---
title: "Getting Started with Kubernetes"
description: "Introduction to Kubernetes for beginners."
publishDate: 2025-04-19
tags: ["Beginner", "DevOps", "Kubernetes", "Cloud"]
draft: false
coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80"
author: "Abhishek Laha"
---

Kubernetes (often referred to as K8s) has become a staple go-to option for container orchestration. It helps you automate the deployment, scaling, and management of containerized applications.

In this article, we'll walk through:

1. What is Kubernetes
2. Introduction to kubectl
3. Local Kubernetes installation options
4. Setting up Kubernetes using Minikube (cross-platform)

## 1. What is Kubernetes?
Kubernetes is an open-source platform designed to automate deploying, scaling, and operating containerized applications. Originally developed by Google, it's now maintained by the Cloud Native Computing Foundation (CNCF).

With Kubernetes, you can:
1. Deploy applications consistently
2. Manage clusters of containers
3. Ensure high availability and scalability
4. Perform rolling updates and rollbacks

## 2. Introduction to kubectl

kubectl is the Kubernetes command-line tool. It's used to communicate with the Kubernetes API server, allowing you to interact with and manage your Kubernetes clusters. Think of it as the main way you'll deploy applications, inspect cluster resources, and manage the system.

Head over to the [official Kubernetes documentation](https://kubernetes.io/docs/reference/kubectl/overview/) for a comprehensive guide on installing and using kubectl.

## 3. Local Kubernetes Installation Options

To run Kubernetes locally for learning or testing, you can use any of the following tools:

1. Minikube – Lightweight VM-based or container-based local cluster
2. Kind – Runs Kubernetes in Docker containers
3. k3s – Lightweight Kubernetes distribution
4. Docker Desktop – Includes built-in Kubernetes support (macOS/Windows)
5. MicroK8s – Minimal, lightweight Kubernetes from Canonical (Ubuntu)

> We'll focus on Minikube in this guide.

## 4. Setting Up Kubernetes with Minikube

Minikube sets up a single-node Kubernetes cluster by default on your local machine. It's beginner-friendly and supports all major OS platforms. It is also capable of running multinde clusters.

### Step 1: Install Minikube

➤ Windows: 

- Download the Minikube installer from the [official website](https://minikube.sigs.k8s.io/docs/start/) and run it.

- Alternatively, you can use the Chocolatey package manager:  
```powershell
choco install minikube
```
- If you're using Winget, you can use the following command:
```powershell
winget install minikube
```

➤ macOS: 

- Install using Binary:
```bash
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

- Install using Homebrew package manager:
```bash
brew install minikube
```

➤ Linux: Install Minikube using the package manager for your Linux distribution.

- Install Using Binary:
```bash
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

- Installation for Debian-based systems (Debian, Ubuntu, etc.):
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```
- Installation for Red Hat-based systems (RHEL, CentOS, Fedora, etc.):
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm
sudo rpm -Uvh minikube-latest.x86_64.rpm
```

### Step 2: Start Minikube

> Prerequisite: You need a container or VM driver installed (like Docker, VirtualBox, or Hyper-V).

```bash
minikube start
```

You can also specify the driver:

```bash
minikube start --driver=docker
```

### Step 3: Verify the Cluster

```bash
kubectl get nodes
```

You should see one node in the "Ready" state.

That's it!

You've successfully installed Kubernetes locally using Minikube. 


## Conclusion

Getting started with Kubernetes may seem daunting at first, but with tools like Minikube and kubectl, it's easier than ever to set up a local cluster and begin exploring. Whether you're a developer looking to test your containerized apps, or a DevOps engineer diving into orchestration, Kubernetes offers a powerful platform to scale and manage your workloads efficiently.

Now that you've set up your local environment, you're ready to dive into the world of Kubernetes.

In future posts, we'll dive into deploying applications, creating services, and understanding core components like Pods, Deployments, and Services.

Thanks for visiting and stay tuned for the next one. Until then, keep learning and stay secure!
