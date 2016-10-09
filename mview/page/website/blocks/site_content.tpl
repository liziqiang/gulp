<div class="f-mgt-10 m-cd-list" data-list-items="1" bc="listVideos">
    <% each $block.contents as $sitem $sidx %>
    <%if ($block.contents.length-1) % 2 == 0 || $sidx < $block.contents.length - 1 %>
    <%if $sitem.extend && $sitem.extend.mv && $sitem.extend.mv.length %>
        <%each $sitem.extend.mv as $vitem $vidx %>
        <%if ~['mplay','vplay'].indexOf($vitem.template) && $vidx == 0 %>
        <%if $sidx == 0 %>
        <% $vitem.isFull = true %>
        <%/if%>
        <div class="m-site-i-wrap<%if !$vitem.isFull %> m-cd-i-wrap<%/if%>">
            <%if $vitem.template == 'mplay' || $vitem.template == 'vipmedia' %>
            <% $vitem.url = '/mplay/?mid=' + $vitem.id %>
            <%else if $vitem.template == 'vplay'%>
            <% $vitem.url = '/vplay/?vid=' + $vitem.id %>
            <%/if%>
            <%if $vitem.template.indexOf('topic') > -1 %>
            <% $vitem.isTopic = true %>
            <%/if%>
            <div class="m-cd-i f-cb">
                <a href="<% $vitem.url %>">
                    <div class="pic">
                        <img src="http://img.funshion.com/img/blank.gif" data-src="<% $vitem.still | imgOpt:$vitem.isFull ? '':'still' %>" alt="<% $vitem.title %>" class="lazy-alpha-start"/>
                        <%if $vitem.update %>
                        <span class="sd"><% $vitem.update %></span>
                        <%else if $vitem.category && $vitem.area %>
                        <span class="sd"><% $vitem.area.split(',')[0] %> | <% $vitem.category.split(',')[0] %></span>
                        <%else if $vitem.duration %>
                        <span class="r-sd"><% $vitem.duration %></span>
                        <%else if $vitem.score %>
                        <span class="r-sd"><% $vitem.score %>分</span>
                        <% /if %>
                    </div>
                </a>
                <div class="site-item">
                    <a class="pic" href="/channel/?id=<% $sitem.mid %>">
                        <img class="lazy-alpha-start" alt="" src="http://img.funshion.com/img/blank.gif" data-src="<% $sitem.icon | imgOpt:'siteIco' %>">
                    </a>
                    <h3 class="site-tit"><a href="/channel/?id=<% $sitem.mid %>"><% $sitem.name %></a></h3>
                </div>
                <h3 class="tit"><a href="<% $vitem.url %>"><% $vitem.name %></a></h3>
            </div>
        </div>
        <%/if%>
        <% /each %>
    <%/if%>
    <%/if%>
    <% /each %>
</div>