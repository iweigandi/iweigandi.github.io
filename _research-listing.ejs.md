::: {.list .quarto-listing-default}

<% for (const item of items) {
  const source = /^https?:\/\//i.test(item.path) ? item.path : null;
%>

<div class="quarto-post image-left" <%= metadataAttrs(item) %>>

```{=html}
<div class="thumbnail">
<% if (item.image) { %>
  <img class="thumbnail-image" loading="lazy" src="<%- item.image %>" alt="<%- item['image-alt'] || '' %>">
<% } %>
</div>
```

::: {.body}

<h3 class="no-anchor listing-title"><% if (source) { %><a href="<%- source %>"><%= item.title %></a><% } else { %><%= item.title %><% } %></h3>
<% if (item.subtitle) { %>
<div class="listing-subtitle"><%= item.subtitle %></div>
<% } %>

<% if (source) { %>
<div class="post-actions"><a class="btn btn-outline-primary btn-sm" href="<%- source %>">Read online</a></div>
<% } %>

<% if (item.description) { %>
::: {.listing-description}

<%= item.description %>

:::
<% } %>

:::

</div>

<% } %>

:::
