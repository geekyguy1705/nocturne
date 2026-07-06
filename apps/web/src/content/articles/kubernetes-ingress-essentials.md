---
title: "Kubernetes Ingress Essentials: Setup, Routing, Annotations and Best Practices"
description: "A detailed guide to Kubernetes Ingress Controllers and Configurations along with Annotations and Best Practices."
publishDate: 2025-05-01
tags: ["Beginner", "DevOps", "Kubernetes", "Ingress", "Best Practices"]
draft: false
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
author: "Abhishek Laha"
---

As you start exposing your services in Kubernetes beyond the cluster, Ingress becomes a powerful resource to manage external access. In this article, we'll break down the Ingress Controller, how it works, how to set it up, and what to avoid while working with it.

## What is an Ingress Controller?

In Kubernetes, Services expose your application internally (ClusterIP) or externally (NodePort/LoadBalancer). But when you need a smarter routing mechanism (like routing based on host or path), that's where Ingress and Ingress Controllers come in.

An Ingress is a Kubernetes object that defines how traffic should be routed to your services. However, it does nothing on its own — it needs an Ingress Controller to fulfill the routing rules defined in the Ingress resource.

> Think of it like this:
> - Ingress resource = Routing rules
> - Ingress Controller = The engine that applies those rules using a reverse proxy (like NGINX, Traefik, HAProxy, etc.)

## Key Components You Should Know
Here are some core terms to get comfortable with:

- Ingress Resource: Declares HTTP/S routing rules (host/path based).

- Ingress Controller: The actual implementation that listens to the Ingress resources and configures a reverse proxy accordingly.

- Backend Service: The Kubernetes Service that receives the traffic routed by the Ingress Controller.

- Annotations: Often used to enable advanced features like rewrites, SSL redirects, and timeouts.

## Setting Up an Ingress Controller (NGINX Example)

Let's walk through a simple example using the popular NGINX Ingress Controller.

#### Step 1: Install the Ingress Controller
For Minikube:

```bash
minikube addons enable ingress
```

For general Kubernetes (using Helm):

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

#### Step 2: Deploy Your Services

Assume you have two deployments **app1 and app2** each exposed via a ClusterIP service.

```bash
kubectl create deploy app1 --image=nginx
kubectl expose deploy app1 --port=80 --target-port=80

kubectl create deploy app2 --image=httpd
kubectl expose deploy app2 --port=80 --target-port=80
```

#### Step 3: Create an Ingress Resource
Here's how you can define routing rules for both apps:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: demo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  # Add your domain here if present
  # - host: myapps.local 
  - http:
      paths:
      - path: /app1
        pathType: Prefix
        backend:
          service:
            name: app1
            port:
              number: 80
      - path: /app2
        pathType: Prefix
        backend:
          service:
            name: app2
            port:
              number: 80
```

Apply it:
```bash
kubectl apply -f ingress.yaml
```

---

## Useful Annotations and Advanced Configuration

Once your Ingress is working, annotations can help you unlock more powerful features of the Ingress Controller. Below are some practical and commonly used annotations for the NGINX Ingress Controller:

1. Rewrite Target
Useful when your backend app doesn't know it's running behind a path prefix.

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
```

> If you forget to rewrite the target or misconfigure the path, you'll often see 404 errors from your backend.

2. Force SSL Redirect
Redirect all HTTP traffic to HTTPS.

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

> Be careful when testing locally or using self-signed certs — this can cause redirect loops or unexpected failures if TLS isn't set up correctly.

3. Custom Timeout Settings
Control how long the ingress waits before timing out.

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "5"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "10"
```

> Make sure these timeouts are also reflected in your backend if you want consistent behavior.

4. Enable CORS (Cross-Origin Resource Sharing)
If your frontend and backend are on different domains/subpaths:

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
```

> Using "*" in production is discouraged for security. Instead, specify allowed origins precisely.

5. Basic Authentication
Add HTTP basic auth to your exposed service.

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/auth-type: "basic"
    nginx.ingress.kubernetes.io/auth-secret: "basic-auth"
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
```

> Don't forget to create the basic-auth secret using htpasswd. Without it, requests will fail with a 503.

---

## Ingress Configuration Best Practices

1. Use Path-Based Routing Thoughtfully
   - Group related paths under a common prefix (/api, /admin, etc.) for easier rewrites.
   - Always define pathType as Prefix or Exact explicitly to avoid unintended matches.

2. Avoid Wildcard CORS in Production
   - Instead of cors-allow-origin: "*", define specific trusted domains.
   - This improves security, especially if APIs return sensitive data.

3. Use Proper Timeout Settings
   - Avoid overly high timeouts, which can tie up Ingress resources.
   - Set appropriate proxy timeouts for each app depending on expected response times.
   - Example: `nginx.ingress.kubernetes.io/proxy-read-timeout: "10"`

4. Limit Exposure Using Authentication
   - Protect internal services or admin panels using basic auth or JWT-based auth (with external plugins).
   - Never expose sensitive apps directly without some form of access control.

5. Enable Rate Limiting for Public Endpoints
   - Helps prevent abuse and accidental DoS from misbehaving clients.
   - Use annotations like:
```yaml
nginx.ingress.kubernetes.io/limit-connections: "1"
nginx.ingress.kubernetes.io/limit-rpm: "60"
```

6. Use Unique Ingress Names and Hosts
   - Avoid conflicting hostnames across multiple Ingress resources.
   - Prefer centralized or consolidated Ingress configs per domain where possible.

7. Test with a Local DNS Entry
   - Use /etc/hosts to map custom domains (like myapp.local) for local testing.
   - Always verify behavior in dev/stage environments before deploying to production.

8. Watch Resource Limits
   - Ingress controllers run as pods — make sure they have CPU/memory limits.
   - Monitor their performance, especially under load or when you have many rules.

9. Use Readiness Probes for Backend Services
    - If a backend service isn't ready, the Ingress will return 502.
    - Ensure your Deployments include health checks so services register properly with the Ingress.

---

### Putting It All Together: Full Ingress Example with Advanced Annotations

Here's a complete example of an Ingress resource that includes the most useful annotations we've discussed. This Ingress:

- Routes traffic to two apps (app1 and app2) based on path.
- Rewrites paths to match backend expectations.
- Forces SSL redirection.
- Enables CORS.
- Sets custom timeouts.
- Adds basic authentication.
- Uses HTTPS

```bash
# Create a TLS Secret
kubectl create secret tls myapps-tls-secret \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n your-namespace
```
> Replace path/to/tls.crt and tls.key with your actual certificate files

```yaml
# Apply ingress config
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: advanced-demo-ingress
  namespace: your-namespace
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "5"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "10"
    nginx.ingress.kubernetes.io/auth-type: "basic"
    nginx.ingress.kubernetes.io/auth-secret: "basic-auth"
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
spec:
  tls:
  - hosts:
      - myapps.local
    secretName: myapps-tls-secret
  rules:
  - host: myapps.local
    http:
      paths:
      - path: /app1
        pathType: Prefix
        backend:
          service:
            name: app1
            port:
              number: 80
      - path: /app2
        pathType: Prefix
        backend:
          service:
            name: app2
            port:
              number: 80
```

> Don't forget to:
> - Update your /etc/hosts to map myapps.local to your cluster IP.
> - Create the basic-auth secret using htpasswd.
> - Ensure TLS is properly configured if using HTTPS in your cluster.

---

## Wrapping Up

Ingress Controllers are essential for managing external traffic to Kubernetes applications. While the basic setup is straightforward, leveraging advanced annotations gives you fine-grained control over routing, security, and performance.

By understanding and applying these configurations:
- You gain flexibility in how apps are exposed.
- You improve security through TLS and authentication.
- You avoid common pitfalls by configuring timeouts, rewrites, and headers properly.

Next up: In the upcoming article, we'll explore how to handle configurations with ConfigMaps, and persistent storage in Kubernetes.

Stay Tuned for the next one. Until then, keep learning and stay secure!
