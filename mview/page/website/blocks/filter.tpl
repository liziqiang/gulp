<%if $block.contents && $block.contents.length %>
<div class="g-con m-fl-wrap">
<%each $block.contents %>
    <a href="/retrieve/?<% $value.extend | param %>" class="m-fl-i">
        <img class="lazy-alpha-start" alt="" src="http://img.funshion.com/img/blank.gif" data-src="<% $value.icon %>">
        <p class="tit"><% $value.name %></p>
    </a>
<%/each%>
</div>
<%/if%>