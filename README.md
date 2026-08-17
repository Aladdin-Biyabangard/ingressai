# Ingress AI

A web panel for Ingress Academy learners and staff: sign in, follow referral programmes, and ask an AI help centre about courses — in Azerbaijani, English and Russian.

## Overview

Ingress AI is the operator-facing frontend for Ingress Academy’s AI-assisted experience. It is for students and staff who already use the academy, not a replacement for the public course catalogue.

The problem it solves is simple: people need a place to log in, get help about programmes, and take part in referral campaigns without leaving the academy’s own product.

It talks to backend APIs for authentication, courses and chat. This repository is the interface those APIs are used through.

## Key Features

- **Sign in and account recovery** — login, registration, forgot password, verification code and password reset
- **Protected dashboard** — signed-in home with referral programme cards, progress and invite links
- **AI help centre** — chat widget and full chat page, with conversation history against a course context
- **Referral administration** — admin-only screens to list and create referral programmes
- **Multilingual UI** — AZ / EN / RU
- **Role-aware routing** — authenticated routes and a separate admin gate

## How It Works

```text
Learner / staff
        ↓
Ingress AI panel  (this app)
        ↓
Auth, course and chat APIs
        ↓
Help-centre replies  ·  referral programmes
```

The person signs in, lands on the dashboard, and can open chat or share a referral invite. Admins manage referral programmes from dedicated routes.

## My Role

I built this frontend: the authenticated product UI, the help-centre chat, referral flows, localisation and the Docker/nginx delivery path.

## Technical Details

| Area | Choice |
|------|--------|
| UI | React 18, TypeScript, Vite |
| Routing | React Router, locale-prefixed routes (`/az`, `/en`, `/ru`) |
| Data | TanStack Query, Axios |
| i18n | i18next / react-i18next |
| UI kit | shadcn/ui, Tailwind CSS |
| Forms | react-hook-form |
| Tests | Vitest, Playwright |
| Delivery | Docker multi-stage build, nginx for the static app |

`VITE_BASE_URL` and `VITE_COURSE_MS_URL` are baked in at image build time.

## Getting Started

```bash
git clone https://github.com/Aladdin-Alizade/ingressai.git
cd ingressai
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm test`.

Point the Vite env at the auth and course/chat services the panel should use, then:

```bash
docker build \
  --build-arg VITE_BASE_URL=... \
  --build-arg VITE_COURSE_MS_URL=... \
  -t ingressai .
```

## Project Status

Active frontend for Ingress Academy’s AI panel. The backend APIs live in separate services; this repository is the web client.
