FROM docker.io/library/node:22-alpine AS frontend-build
WORKDIR /build
RUN npm install -g pnpm@10
COPY frontend/ .
ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM alpine:3.20.3
LABEL maintainer="signoz"
WORKDIR /root

ARG OS="linux"
ARG TARGETARCH

RUN apk update && \
	apk add ca-certificates && \
	rm -rf /var/cache/apk/*

COPY ./target/${OS}-${TARGETARCH}/signoz-community /root/signoz
COPY ./templates /root/templates
COPY --from=frontend-build /build/build /etc/signoz/web

RUN chmod 755 /root /root/signoz

ENTRYPOINT ["./signoz", "server"]
