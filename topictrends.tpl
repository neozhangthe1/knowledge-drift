<link rel="stylesheet" type="text/css" href="/static/css/topictrend.css">
<link rel="stylesheet" type="text/css" href="/static/css/frame.css">

<div id="chart" class="pull-left">
  <div class="modal-loading"></div>
</div>
<div id="bottom-box" ></div>

<div id="right-box">
  <div class="slider-bar">
    <div class="control-left-text i18n i18n-expand-threshold">#people</div>
    <div id="ctrl-expand-threshold" class="pkuvis-slider pkuvis-slider-center" style="width: 120px; position: relative; height: 16px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; display: inline-block; vertical-align: top; margin: 4px; background-color: rgb(204, 204, 204);">
      <div style="width: 16px; height: 16px; position: absolute; top: 0px; left: 9.454545454545455px; background-color: rgb(31, 119, 180); border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; cursor: pointer;">
      </div>
    </div>
    <span id="ctrl-expand-threshold-value">10</span>
  </div>
  <div class="slider-bar">
    <div class="control-left-text i18n i18n-node-size-scale">window</div>
    <div id="ctrl-node-size" class="pkuvis-slider pkuvis-slider-center" style="width: 120px; position: relative; height: 16px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; display: inline-block; vertical-align: top; margin: 4px; background-color: rgb(204, 204, 204);">
      <div style="width: 16px; height: 16px; position: absolute; top: 0px; left: 52px; background-color: rgb(31, 119, 180); border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; cursor: pointer;"></div>
    </div>
    <span id="ctrl-node-size-value">1 year</span>
  </div>

  <div id="rightlist-listpos"></div>
  <div id="rightlist-users">
    <div id="people-lists">
      <div class="header">
        People:
        <span class="info">
          <span class="info-followers sort-followers" onclick="do_change_userlist_sort('followers', this);">#pub</span>
          <span class="info-posts sort-posts" onclick="do_change_userlist_sort('posts', this);">#cite</span>
          <span class="info-reposts sort-retweets active" onclick="do_change_userlist_sort('retweets', this);">hindex</span>
        </span>
      </div>
      <div id="people-list"></div>
    </div>
  </div>
</div>
<script src="/static/js/topictrend.js"></script>
%rebase layout