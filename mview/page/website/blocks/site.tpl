<%if $block.contents && $block.contents.length %>
<section class="g-con<%if $bidx > 0 %> f-mgt-10<%else%> f-no-bt<% /if %>" data-card-item="1"
         data-deliver="mw_###F.config.ctrlname###_b">
    <%if $bidx > 0 %>
    <h2 class="m-h2-tit f-cb" bc="listTit">
        <% if $block.channel && ($block.channel.id || $block.channel.extend) %>
            <a href="/retrieve/?channel=<% $block.channel.id %>&name=<% $block.channel.name %>">
                <span class="tit"><% $block.name %></span>
            </a>
            <% if !$block.channel.extend %>
            <a class="more" href="/?channel=<% $block.channel.id %>">更多></a>
            <% else %>
            <a class="more" href="/retrieve/?<% $block.channel.extend | param %>">更多></a>
            <% /if %>
        <% else %>
            <span class="tit"><% $block.name %></span>
        <% /if %>
    </h2>
    <%/if%>
    <!--inline[site_content.tpl]-->
</section>
<%/if%>