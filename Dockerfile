# 프로젝트의 node.js 버전에 맞는 기본 이미지 지정
FROM node:22.13-slim AS dependencies

# 작업 디렉토리 지정
WORKDIR /app

# 의존성 설치에 필요한 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozon-lockfile

FROM node:22.13-alpine AS builder

WORKDIR /app

# 설치된 의존성들이 담긴 파일 복사
COPY --from=dependencies /app/node_modules ./node_modules

# 소스 코드 복사
COPY . .

ARG MONGO_URL="mongodb://localhost:27017"
ENV MONGO_URL=${MONGO_URL}
ENV APP_ENV=docker

RUN yarn build

FROM node:22.13-alpine AS runner

WORKDIR /app

# 앱 실행에 필요한 파일들 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# HTTP 트래픽을 허용하기 위한 3000번 포트 개방
EXPOSE 3000

# Next.js 독립 실행(standalone) 서버 시작
CMD ["node", "server.js"]