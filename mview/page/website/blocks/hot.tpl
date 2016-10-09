<div class="g-con f-mgb-10 m-cd-list stream-list">
    <div class="m-cd-i stream-item" data-hot-info="<% $vitem | stringfy %>">
        <div class="pic stream-player-wrap j-stream-player-wrap">
            <img src="http://img.funshion.com/img/blank.gif" data-src="<% $vitem.still %>" alt="<% $vitem.title %>" class="lazy-alpha-start"/>
            <%if $vitem.duration %>
            <span class="r-sd"><% $vitem.duration %></span>
            <% /if %>
            <div class="stream-play-btn"></div>
            <h3 class="tit"><% $vitem.name %></h3>
        </div>
        <div class="hot-info">
            <% if $vitem.vv %>
            <span>播放：<% $vitem.vv | vvFormat %></span>
            <% /if %>
            <span class="j-share-toggle share-btn"><i class="i-share"></i>分享</span>
        </div>
    </div>
</div>