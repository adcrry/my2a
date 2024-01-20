FROM nginx:1.25.2-alpine3.18 as base

# ======================== DEV ENVIRONMENT ========================
FROM base as development
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

FROM base as production
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-prod.conf /etc/nginx/conf.d