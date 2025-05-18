function ueDynamicPopup(popupId){var g_objGrid,g_objDynamicPopup,g_objOverlay,g_objCloseButton,g_arrowNext,g_arrowPrev,g_objIframeHolder,g_parentWidgetPopupLinks,g_objPopupButtons,g_objGridWidget,g_objArrows,g_objCarousel;var g_selectorPopup,g_selectorGrid,g_popupButtonSelector,g_openedPopupButtonClass;var g_activeClass,g_classPopupOpened,g_singleDynamicPopupClass,g_classClosing,g_classLoaded,g_classLoading,g_templateHolderClass;var g_isDebugOn,g_isInEditor,g_templateId,g_debugConsole,g_advancedCache,g_closeAfterAddedToCart;var g_showDebug=!1;var g_openedPopupIndex;var g_arrowsTopPosition,g_equalDataPostLinksNum,g_isPopupSingle,g_time,g_loadingTimer,g_cache={},g_bulkCache={};function trace(val){console.log(val)}
function getOffsetsDistance(offset1,offset2){var dx=offset2.left-offset1.left;var dy=offset2.top-offset1.top;return Math.sqrt(dx*dx+dy*dy)}
function getClosestByOffset(objParents,objElement,isVertical){if(objParents.length==0){throw new Error("get closest by offset error - grids not found")}
if(g_showDebug==!0){trace("get closest grids for");trace(objElement)
trace("parents");trace(objParents)}
var objClosest=null;var minDiff=1000000;var elementOffset=objElement.offset();jQuery.each(objParents,function(index,parent){var objParent=jQuery(parent);var objGrid=jQuery(parent);var distance=0;var isVisible=objParent.is(":visible");var constantHeight=null;if(isVisible==!1){objParent=objParent.parent()}
var parentOffset=objParent.offset();if(isVertical==!0){var offsetY=elementOffset.top;var parentY=parentOffset.top;if(parentY<offsetY)
parentY+=objParent.height();var distance=Math.abs(offsetY-parentY)}else{var parentOffset=objParent.offset();var distance=getOffsetsDistance(parentOffset,elementOffset)}
if(g_showDebug==!0){trace(objParent);trace("distance: "+distance);trace("is vertical: "+isVertical)}
if(distance<minDiff){minDiff=distance;objClosest=objGrid}});if(g_showDebug==!0){trace("popup: ");trace(objElement);trace("Closest grid found:");trace(objClosest)}
return(objClosest)}
function getAllGrids(){var objGrids=jQuery(g_selectorGrid);return(objGrids)}
function getGridFromParentContainers(objSource){var objParents=objSource.parents();var objGrid=null;objParents.each(function(){var objParent=jQuery(this);objGrid=objParent.find(g_selectorGrid);if(objGrid.length==1)
return(!1)});return(objGrid)}
function getClosestGrid(objSource){if(g_objGrid)
return(g_objGrid);var objGrids=getAllGrids();if(objGrids.length==0)
return(null);var objSection=objSource.parents("section");var objGrid=objSection.find(g_selectorGrid);if(objGrid.length==1)
return(objGrid);var objElementorTab=objSource.parents(".e-n-tabs-content > .e-con");var objGrid=objElementorTab.find(g_selectorGrid);if(objGrid.length==1)
return(objGrid);var objGrid=getGridFromParentContainers(objSource);if(objGrid&&objGrid.length==1)
return(objGrid);var objSingleGrid=getClosestByOffset(objGrids,objSource,!0);if(objSingleGrid&&objSingleGrid.length==1)
return(objSingleGrid);var objFirstGrid=jQuery(objGrids[0]);return(objFirstGrid)}
function initDynamicPopup(objDynamicPopup){var objGrid=getClosestGrid(objDynamicPopup);if(!objGrid)
return(!1);objDynamicPopup.attr("data-grid",objGrid.attr('id'));if(objGrid.data('dynamic-popup')=='')
return(!1);objGrid.attr("data-dynamic-popup",objDynamicPopup.attr('id'))}
function initDynamicPopups(){var objDynamicPopups=jQuery(g_selectorPopup);if(objDynamicPopups.length==0)
return(!1);jQuery.each(objDynamicPopups,function(index,popup){var objDynamicPopup=jQuery(popup);initDynamicPopup(objDynamicPopup)})}
function getPopupLink(){var popupLink;popupLink=g_objDynamicPopup.attr("data-src");if(g_debugConsole==!0){trace(g_objDynamicPopup)
trace('popupLink')
trace(popupLink)}
if(g_isDebugOn==!0&&g_isInEditor=='yes')
popupLink=g_objIframeHolder.data('debug-post');return(popupLink)}
function setLinkTargetToParent(objIframe){var isTargetParent=g_objDynamicPopup.data("link-target-parent");if(isTargetParent==!1)
return(!1);var objLinks=objIframe.contents().find("a");objLinks.each(function(){var objLink=jQuery(this);objLink.attr("target","_parent")})}
function getIframeSrc(url){var iframeBaseSrc;if(!url)
iframeBaseSrc=getPopupLink();else iframeBaseSrc=url;var urlIframe=iframeBaseSrc+'?ucrendertemplate='+g_templateId;return(urlIframe)}
function getDataFromCache(src){if(g_cache[src]){var iframe=g_cache[src];return(iframe)}}
function getDataFromBulkCache(src){if(g_bulkCache[src]){var data=g_bulkCache[src];return(data)}else{return(null)}}
function createIframeForAjaxFirstGridItem(){g_time=0.000;g_loadingTimer=setInterval(function(){g_time+=0.001},1);var urlIframe=getIframeSrc();var iframeHtml='<iframe class="uc-iframe" style="display:none;" src="" frameborder="0" ></iframe>';g_objIframeHolder.html(iframeHtml);var objIframe=getObjIframe();if(g_advancedCache==!1)
ajaxLoad(urlIframe,objIframe);objIframe.load(function(e){setTimeout(function(){adjustHeight(objIframe)},300)})}
function getUrlIframe(objLink){var dataPostLink=objLink.data("post-link");var urlIframe=getIframeSrc(dataPostLink);return(urlIframe)}
function loadPopup(urlIframe){jQuery.get(urlIframe,function(data){g_cache[urlIframe]=data;if(g_debugConsole==!0)
trace('loaded to cache: '+urlIframe)})}
function loadPopupsToCahce(){g_parentWidgetPopupLinks=g_objGridWidget.find(g_popupButtonSelector);var activeIndex=0;g_parentWidgetPopupLinks.each(function(index,link){var objLink=jQuery(this);if(objLink.hasClass(g_openedPopupButtonClass)==!0){var dataPopupNum=objLink.data("dynamic-popup-num");activeIndex=dataPopupNum}});if(activeIndex==0)
return(!1);var objLink=g_objGridWidget.find('[data-dynamic-popup-num="'+(activeIndex+1)+'"]');var urlIframe=getUrlIframe(objLink);if(!g_cache[urlIframe]){if(g_debugConsole==!0)
trace("no such poup loaded in cache: "+urlIframe);loadPopup(urlIframe)}else{if(g_debugConsole==!0)
trace("this popup is loaded in cache: "+urlIframe);objLink=g_objGridWidget.find('[data-dynamic-popup-num="'+(activeIndex-1)+'"]');urlIframe=getUrlIframe(objLink);if(!g_cache[urlIframe])
loadPopup(urlIframe);else{if(g_debugConsole==!0)
trace('this iframe is loaded too: '+urlIframe)}}}
function getObjLoader(){var objLoader=g_objDynamicPopup.find('.ue-loader');return(objLoader)}
function getObjIframe(){var objIframe=g_objDynamicPopup.find('.uc-iframe');return(objIframe)}
function modifyLoadedIframe(objIframe,e){var objLoader=getObjLoader();objLoader.hide();objIframe.show();var objIframeHeader=objIframe.contents().find("header");var objIframeFooter=objIframe.contents().find("footer");var objInnerHtml=objIframe.contents().find("html");if(objInnerHtml.length){if(objInnerHtml.css('margin-top')!=0){var objHead=objIframe.contents().find("head");var dataHideVerticalScroll=g_objIframeHolder.data("hide-scroll");var styleHtml;var styleId="ue-dynamic-post-popup-styles-override";var objStyle=objIframe.contents().find(`#${styleId}`);if(dataHideVerticalScroll==!0)
styleHtml="<style id='"+styleId+"'>html{margin-top:0 !important}body,html{-ms-overflow-style: none; scrollbar-width: none;}body::-webkit-scrollbar,html::-webkit-scrollbar{display: none;}</style>";else styleHtml="<style id='"+styleId+"'>html{margin-top:0 !important}</style>";if(!objStyle||objStyle.length==0)
objHead.append(styleHtml)}}
if(objIframeHeader.length)
objIframeHeader.remove();if(objIframeFooter.length)
objIframeFooter.remove();setLinkTargetToParent(objIframe);adjustHeight(objIframe);if(e){jQuery(e.target.contentWindow).on('scroll',function(scroll){scrollArrowsWithIframe(scroll,g_arrowsTopPosition)})}}
function createIframe(){g_objArrows.css('top','');var objLoader=getObjLoader();objLoader.show();g_time=0.000;g_loadingTimer=setInterval(function(){g_time+=0.001},1);var urlIframe=getIframeSrc();var iframeHtml;iframeHtml='<iframe class="uc-iframe" style="display:none;" src="" frameborder="0" ></iframe>';var objPopupLink=g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');var isPopupLoaded=objPopupLink.hasClass("grid-item-loaded");if(g_debugConsole==!0){trace('isPopupLoaded')
trace(isPopupLoaded)
trace('objPopupLink')
trace(objPopupLink)}
if(isPopupLoaded==!1&&g_advancedCache==!1){g_objIframeHolder.html(iframeHtml)}
g_objOverlay.addClass(g_activeClass);var objIframe=getObjIframe();if(isPopupLoaded==!1){if(g_advancedCache==!1){ajaxLoad(urlIframe,objIframe)}else{var url=getBulkCacheUrl();appendContentFromBulkCache(url,objIframe)}
if(g_debugConsole==!0){trace('ajax loaded')}
var objAllLoadedPopuplinks=jQuery(".uc-open-popup.grid-item-loaded");if(objAllLoadedPopuplinks&&objAllLoadedPopuplinks.length>0)
objAllLoadedPopuplinks.removeClass('grid-item-loaded')}
if(g_advancedCache==!1){if(isPopupLoaded==!0)
modifyLoadedIframe(objIframe);else{objIframe.load(function(e){modifyLoadedIframe(objIframe,e)})}
if(g_closeAfterAddedToCart==!0){var scriptElem=`<script id="ue-message-sender">document.body.addEventListener("added_to_cart", function(){window.parent.postMessage({ue_event: "ue_addedtocart", action: "product_added_to_cart"},"*");})</script>`;objBody.append(scriptElem)}}}
function findParentWidgetPopupLinks(){g_parentWidgetPopupLinks=g_objGridWidget.find(g_popupButtonSelector);g_parentWidgetPopupLinks.each(function(index,link){var objLink=jQuery(this);objLink.attr('data-dynamic-popup-num',index);var dataPostLink=objLink.data('post-link');var objEqualDataPostLinks=g_objGridWidget.find('[data-post-link="'+dataPostLink+'"]');if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass)==!1){g_equalDataPostLinksNum=objEqualDataPostLinks.length;var popupItemIndex=Math.floor(index/g_equalDataPostLinksNum);objEqualDataPostLinks.attr('data-dynamic-popup-num',popupItemIndex)}
if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass)==!0)
g_isPopupSingle=!0;if(objLink.hasClass(g_openedPopupButtonClass)==!1)
return(!0);g_openedPopupIndex=objLink.data('dynamic-popup-num')})}
function removeOpenClassesFromPopup(){g_objOverlay.removeClass(g_activeClass);g_objOverlay.removeClass(g_classClosing)}
function clearPopup(){if(g_isDebugOn==!0&&g_isInEditor=='yes')
return(!1);g_objOverlay.addClass(g_classClosing);var dataAnim=g_objIframeHolder.data("anim");var timeoutTime=Number(g_objIframeHolder.data("anim-speed"))*1000*.9;if(dataAnim!="none")
setTimeout(removeOpenClassesFromPopup,timeoutTime);else removeOpenClassesFromPopup();g_objDynamicPopup.removeData('src');var objIframe=getObjIframe();objIframe.attr('srcdoc',"");jQuery('body').removeClass(g_classPopupOpened);jQuery('html').removeClass(g_classPopupOpened);stopVideo();var objAllLoadedPopuplinks=jQuery(".uc-open-popup.grid-item-loaded");if(objAllLoadedPopuplinks&&objAllLoadedPopuplinks.length>0)
objAllLoadedPopuplinks.removeClass('grid-item-loaded')}
function onArrowNextClick(){if(!g_objPopupButtons)
return(!1);var itesmAmount;if(g_isPopupSingle==!0)
itesmAmount=g_objPopupButtons.length;else itesmAmount=g_objPopupButtons.length/g_equalDataPostLinksNum;g_openedPopupIndex++;if(g_openedPopupIndex>=itesmAmount)
g_openedPopupIndex=0;var objNextParentPopupLinks=g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');clearPopup();objNextParentPopupLinks.each(function(index,link){var objNextPopupLink=jQuery(this);if(index==0){objNextPopupLink.trigger('click')}})}
function onArrowPrevClick(){if(!g_objPopupButtons)
return(!1);var itesmAmount=g_objPopupButtons.length/g_equalDataPostLinksNum;if(g_isPopupSingle==!0)
itesmAmount=g_objPopupButtons.length;if(g_openedPopupIndex==0)
g_openedPopupIndex=itesmAmount;g_openedPopupIndex--;var objPrevParentPopupLinks=g_objGridWidget.find('[data-dynamic-popup-num="'+g_openedPopupIndex+'"]');clearPopup();objPrevParentPopupLinks.each(function(index,link){var objPrevPopupLink=jQuery(this);if(index==0)
objPrevPopupLink.trigger('click')})}
function scrollArrowsWithIframe(e,arrowsTopPosition){if(!g_objArrows.length)
return(!0);var dataArrowsAlwaysOnTop=g_objDynamicPopup.data('arrows-on-top');if(dataArrowsAlwaysOnTop==!0)
return(!0);var scrollAmount=e.currentTarget.scrollY;g_objArrows.css('top','calc('+(arrowsTopPosition-scrollAmount)+'px)')}
function doOpenPopup(){jQuery('body').addClass(g_classPopupOpened);jQuery('html').addClass(g_classPopupOpened);findParentWidgetPopupLinks();createIframe()}
function onOpenDynamicPopup(){var dataAnim=g_objIframeHolder.data("anim");var timeoutTime=Number(g_objIframeHolder.data("anim-speed"))*1000*.9;if(dataAnim!="none"){setTimeout(doOpenPopup,timeoutTime)}else doOpenPopup()}
function debugPopup(){if(g_isDebugOn==!1)
return(!1);if(g_isInEditor=='no')
return(!1);createIframe()}
function onPopupBtnClick(e){e.preventDefault();var objPopupLink=jQuery(this);var popupLink=objPopupLink.attr("href");var objGrid=objPopupLink.parents('.uc-dynamic-popup-grid');var objPopupWidgetId=objGrid.data('dynamic-popup');var objPopupWidget=jQuery("#"+objPopupWidgetId);if(g_debugConsole==!0){trace('num to set')
trace(g_openedPopupIndex)
trace('onPopupBtnClick')}
g_objIframeHolder.attr('data-dynamic-popup-num',g_openedPopupIndex);if(objPopupLink.hasClass('grid-item-loaded')==!1){objPopupWidget.attr("data-src",popupLink)}
g_objPopupButtons.removeClass(g_openedPopupButtonClass);objPopupLink.addClass(g_openedPopupButtonClass);objPopupWidget.trigger("open_dynamic_popup")}
function enablePopupLink(objButtons){if(!objButtons.length)
return(!1);for(let i=0;i<objButtons.length;i++){var objLink=objButtons.eq(i);var dataLinkHref=objLink.data('post-link')
objLink.attr("href",dataLinkHref);objLink.attr("target",'_blank')}}
function adjustHeight(objIframe){var dataAdjustHeight=g_objIframeHolder.data('adjust-height');if(dataAdjustHeight==!1)
return(!1);var objInnerDocument=objIframe.contents().find('body');var objInnerDocumentHeight=objInnerDocument.height();var borderTopWidth=parseInt(objIframe.css('border-top-width'));var borderBottomWidth=parseInt(objIframe.css('border-bottom-width'));var iframHolderPaddingTop=parseInt(g_objIframeHolder.css("padding-top"));var iframHolderPaddingBottom=parseInt(g_objIframeHolder.css("padding-bottom"));var totalHeight=objInnerDocumentHeight;if(borderTopWidth)
totalHeight+=borderTopWidth;if(borderBottomWidth)
totalHeight+=borderBottomWidth;if(iframHolderPaddingTop)
totalHeight+=iframHolderPaddingTop;if(iframHolderPaddingBottom)
totalHeight+=iframHolderPaddingBottom;objIframe.css({'height':totalHeight+'px','max-height':'100vh'});g_objIframeHolder.css({'height':totalHeight+'px','max-height':'100vh'})}
function initPopupLinks(){g_objPopupButtons=g_objGridWidget.find(g_popupButtonSelector);enablePopupLink(g_objPopupButtons);g_objPopupButtons.on("click",onPopupBtnClick);adjustDynamicPopupNumAttrInLoops()}
function stopYoutubeVideo(iframeSrc,objIframe){var isJsApiEnabled=iframeSrc.indexOf("?enablejsapi=1")!=-1;if(isJsApiEnabled==!1)
objIframe.attr('src',iframeSrc+"?enablejsapi=1");else objIframe.attr('src',iframeSrc)
objIframe[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*')}
function stopVideo(){var objIframe=getObjIframe();if(!objIframe)
return(!1);var objInnerIframes=objIframe.contents().find("iframe");if(!objInnerIframes)
return(!1);objInnerIframes.each(function(){var objIframe=jQuery(this);var iframeSrc=objIframe.attr('src');if(!iframeSrc)
return(!0);var isYoutube=iframeSrc.indexOf("youtube")!=-1;var isVimeo=iframeSrc.indexOf("vimeo")!=-1;if(isYoutube!==!1)
stopYoutubeVideo(iframeSrc,objIframe)
if(isVimeo!==!1)
objIframe.attr("src",'')})}
function onGetUrlIframe(data,objIframe){try{objIframe[0].srcdoc=data;objIframe.attr("src","about:blank")}catch(error){console.error("Error writing to iframe document:",error)}
if(g_debugConsole==!0){trace("Ajax Popup Load Time is: "+g_time.toFixed(3)+" s")
clearInterval(g_loadingTimer)}
objIframe.show()}
function loadFirstGridItemPopup(){var objFirstGridItemSrc=g_objGridWidget.find('[data-dynamic-popup-num="0"]');var firstGridItemSrc=objFirstGridItemSrc.data('post-link');if(g_advancedCache==!1)
objFirstGridItemSrc.addClass("grid-item-loaded")
g_objDynamicPopup.attr('data-src',firstGridItemSrc);createIframeForAjaxFirstGridItem()}
function ajaxLoad(urlIframe,objIframe){var cachedData=getDataFromCache(urlIframe);if(g_debugConsole==!0){trace("cachedData:")
trace(cachedData)}
if(cachedData){onGetUrlIframe(cachedData,objIframe);if(g_debugConsole==!0)
trace("loaded from cache");loadPopupsToCahce();return(!1)}
jQuery.get(urlIframe,function(data){if(g_debugConsole==!0){trace('loaded url')}
if(!g_cache[urlIframe])
g_cache[urlIframe]=data;onGetUrlIframe(data,objIframe);setTimeout(loadPopupsToCahce,1000)})}
function getPostsIds(){var postsIdArray=[];if(!g_objPopupButtons||g_objPopupButtons.length==0)
return(null);g_objPopupButtons.each(function(){var objButton=jQuery(this);var dataPostId=objButton.attr("data-postid");var isInArray=postsIdArray.indexOf(dataPostId)!==-1;if(isInArray==!1)
postsIdArray.push(dataPostId)})
return(postsIdArray)}
function getPostIdByIndex(index){var objPopupLink=g_objGridWidget.find('[data-dynamic-popup-num="'+index+'"]');var postId=objPopupLink.data("postid");return(postId)}
function getTemplateByPostId(index,objIframe){var postId=getPostIdByIndex(index);var objTemplateHolderByPostId=objIframe.contents().find(`template[data-postid="${postId}"]`);return(objTemplateHolderByPostId)}
function appendContentFromBulkCache(urlIframe,objIframe,data){var cachedData=getDataFromBulkCache(urlIframe);if(cachedData&&cachedData!==null&&cachedData!==undefined){onGetUrlIframe(cachedData,objIframe)}else{if(data&&data!==undefined)
onGetUrlIframe(data,objIframe);else{objIframe.on("uc_bulk_cache_loaded",function(){cachedData=getDataFromBulkCache(urlIframe);onGetUrlIframe(cachedData,objIframe)})}}
objIframe.load(function(e){var objCachedTemplates=objIframe.contents().find("template");var objCurrentTemplate=objCachedTemplates.eq(g_openedPopupIndex);if(!objCurrentTemplate||objCurrentTemplate.length==0)
objCurrentTemplate=getTemplateByPostId(g_openedPopupIndex,objIframe);var objBody=objIframe.contents().find("body");var currentTemplateHTML=objCurrentTemplate.html();objCachedTemplates.remove();objBody.prepend(currentTemplateHTML);if(g_closeAfterAddedToCart==!0){var scriptElem=`<script id="ue-message-sender">document.body.addEventListener("added_to_cart", function(){window.parent.postMessage({ue_event: "ue_addedtocart", action: "product_added_to_cart"},"*");})</script>`;objBody.append(scriptElem)}
modifyLoadedIframe(objIframe,e)})}
function getBulkCacheUrl(){var postIds=getPostsIds();if(!postIds||postIds==null)
return(null);var postIdsString=postIds.join(", ").replace(/ /g,"");var urlIframe=window.location.href+"?ucrendertemplate="+g_templateId+"&dynamicpopup=true&postids="+postIdsString;return(urlIframe)}
function ajaxLoadBulkCache(){if(g_debugConsole==!0)
trace('bulk cache loading:')
var objIframe=getObjIframe();var urlIframe=getBulkCacheUrl();if(urlIframe==null)
return(!1);var cachedData=getDataFromBulkCache(urlIframe);if(cachedData&&cachedData!==null&&cachedData!==undefined){if(g_debugConsole==!0)
trace('bulk cache already loaded');return(!1)}
jQuery.get(urlIframe,function(data){g_bulkCache[urlIframe]=data;objIframe.trigger("uc_bulk_cache_loaded")})}
function setPopupLinkAttributes(objLink,postLink,index){objLink.attr("data-post-link",postLink);objLink.attr("href",postLink);objLink.attr("data-dynamic-popup-num",index)}
function adjustDynamicPopupNumAttrInLoops(){g_parentWidgetPopupLinks=g_objGridWidget.find(g_popupButtonSelector);g_parentWidgetPopupLinks.each(function(index,link){var objLink=jQuery(this);var objLoopItem=objLink.parents(".ue-grid-item");if(!objLoopItem||!objLoopItem.length)
return(!0);var postLink=objLoopItem.data("link");var tagName=objLink.prop("tagName");if(tagName!="A"){var objNewTag=jQuery("<a></a>");jQuery.each(objLink[0].attributes,function(index,attribute){objNewTag.attr(attribute.name,attribute.value)});objLink.replaceWith(objNewTag.html(objLink.html()));g_objPopupButtons=g_objGridWidget.find(g_popupButtonSelector);setPopupLinkAttributes(objNewTag,postLink,index)}
setPopupLinkAttributes(objLink,postLink,index);var objEqualDataPostLinks=g_objGridWidget.find('[data-post-link="'+postLink+'"]');if(objEqualDataPostLinks.hasClass(g_singleDynamicPopupClass)==!1){var equalDataPostLinksNum=objEqualDataPostLinks.length;var popupItemIndex=Math.floor(index/equalDataPostLinksNum);objEqualDataPostLinks.attr('data-dynamic-popup-num',popupItemIndex)}})}
function getVal(obj,name,defaultValue){if(!defaultValue)
var defaultValue="";var val="";if(!obj||typeof obj!="object")
val=defaultValue;else if(obj.hasOwnProperty(name)==!1){val=defaultValue}else{val=obj[name]}
return(val)}
function initGlobals(){if(typeof g_strFiltersData==="undefined")
return(!1);g_filtersData=JSON.parse(g_strFiltersData);var isShowDebug=getVal(g_filtersData,"debug");if(isShowDebug==!0)
g_debugConsole=!0}
function onUCAjaxRefreshed(){initPopupLinks();ajaxLoadBulkCache()}
function onCalendarRefresh(){g_objPopupButtons=g_objGridWidget.find(g_popupButtonSelector);if(g_advancedCache==!0)
ajaxLoadBulkCache();initPopupLinks()}
function onCloseKeyDown(e){var keyCode=e.keyCode;var objClosePopup=jQuery(this);if(keyCode==13){clearPopup();objClosePopup.blur()}}
function initPopup(){g_ajaxFirstLoadedClass="ue-ajax-first-loaded";g_activeClass="uc-active";g_classPopupOpened="ue-popup-opened";g_singleDynamicPopupClass='ue-dynamic-popup-single';g_classClosing="uc-closing";g_classLoaded="uc-loaded";g_classLoading="uc-loading";g_templateHolderClass="uc-template-holder";g_selectorPopup='.ue-dynamic-popup';g_selectorGrid='.uc-dynamic-popup-grid';g_objDynamicPopup=jQuery("#"+popupId);g_objOverlay=g_objDynamicPopup.find(".ue-dynamic-popup-overlay");g_objCloseButton=g_objDynamicPopup.find(".ue-dynamic-popup-close");g_arrowNext=g_objDynamicPopup.find('.ue-dynamic-popup-next-arrow');g_arrowPrev=g_objDynamicPopup.find('.ue-dynamic-popup-prev-arrow');g_objArrows=g_objDynamicPopup.find('.ue-dynamic-popup-arrows');g_objIframeHolder=g_objDynamicPopup.find('.ue-dynamic-popup-iframe-holder');g_arrowsTopPosition=parseInt(g_objArrows.css('top'));g_isDebugOn=g_objIframeHolder.data('debug');g_isInEditor=g_objDynamicPopup.data('editor');g_templateId=g_objDynamicPopup.data('template');g_debugConsole=g_objDynamicPopup.data("debug-console");g_advancedCache=g_objDynamicPopup.data("advanced-cache");g_closeAfterAddedToCart=g_objDynamicPopup.data("close-after-addedtocart");g_popupButtonSelector='.uc-open-popup';g_openedPopupButtonClass='uc-opened';g_openedPopupIndex=0;initDynamicPopups();var objGridId=g_objDynamicPopup.data('grid');g_objGridWidget=jQuery('#'+objGridId);g_objPopupButtons=g_objGridWidget.find(g_popupButtonSelector);enablePopupLink(g_objPopupButtons);findParentWidgetPopupLinks(g_objGridWidget);adjustDynamicPopupNumAttrInLoops();loadFirstGridItemPopup();if(g_advancedCache==!0)
ajaxLoadBulkCache();g_objPopupButtons.on("click",onPopupBtnClick);g_objGridWidget.on('uc_ajax_refreshed',onUCAjaxRefreshed);g_objGridWidget.on('uc_widget_refreshed',initPopupLinks);g_objGridWidget.on('resized.owl.carousel',initPopupLinks);g_objGridWidget.on('ue_calendar_pagechange',onCalendarRefresh);g_objDynamicPopup.on("open_dynamic_popup",onOpenDynamicPopup);g_objCloseButton.on("click",clearPopup);g_objCloseButton.on("keydown",onCloseKeyDown);g_objOverlay.on("click",function(event){var iframeHolder=g_objDynamicPopup.find(".ue-dynamic-popup-iframe-holder");var navArrow=g_objDynamicPopup.find('.ue-dynamic-popup-arrow');if(jQuery(event.target).closest(navArrow).length)
return(!0);if(!jQuery(event.target).closest(iframeHolder).length)
clearPopup()});var dataShowArrows=g_objDynamicPopup.data('arrows');if(dataShowArrows==!0){g_arrowNext.on('click',onArrowNextClick);g_arrowPrev.on('click',onArrowPrevClick)}
if(g_isInEditor=="yes"){var objMessage=g_objDynamicPopup.find(".uc-editor-message");if(g_templateId=='')
objMessage.append("<br>Please choose a template.");debugPopup()}
initGlobals();if(g_closeAfterAddedToCart==!0){window.addEventListener("message",(event)=>{if(event.data.payload&&event.data.payload.route&&event.data.payload.route.title&&event.data.payload.route.title!="Dynamic Post Popup"){if(g_debugConsole==!0)
trace("added_to_cart event triggered in the iframe.");setTimeout(function(){console.log('trigger events')
jQuery("body").trigger("wc_fragments_loaded");jQuery("body").trigger("added_to_cart");clearPopup()},1000)}},!1)}}
setTimeout(initPopup,800)}