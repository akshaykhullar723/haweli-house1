function ueInfographic(){var g_objInfographic,g_objInnerCircle,g_objButtons,g_objSegments,g_objSegmentSeparators,g_objLines;var g_showSegments,g_objButtonsNumber,g_innerCircleHtml,g_firstSelected,g_selectedItem,g_selectedItemNum;var g_classSelected,g_classActive;var g_activeSegmentIndex;function openFirstItem(){if(g_selectedItem==!1)
return(!1);var objButtonToTrigger=g_objButtons.eq(Number(g_selectedItemNum-1));if(objButtonToTrigger&&objButtonToTrigger.length>0)
objButtonToTrigger.trigger("click");var objSegmentToTrigger=g_objSegments.eq(Number(g_selectedItemNum-1));if(objSegmentToTrigger&&objSegmentToTrigger.length>0)
objSegmentToTrigger.addClass(g_classActive)}
function startInfographic(){var objInfographicWidth=Math.floor(g_objInfographic.width());var g_objInnerCircleWidth=Math.floor(g_objInnerCircle.width());let angle=360-90,dangle=360/g_objButtonsNumber;for(let i=0;i<g_objButtonsNumber;++i){let circle=g_objButtons[i];angle+=dangle;var circlePos;if(g_showSegments==!0)
circlePos='rotate('+angle+'deg) translate('+(objInfographicWidth/2+g_objInnerCircleWidth/2)/2+'px) rotate(-'+angle+'deg)';if(g_showSegments==!1)
circlePos='rotate('+angle+'deg) translate('+(objInfographicWidth/2)+'px) rotate(-'+angle+'deg)';circle.style.transform=circlePos;if(g_objLines&&g_objLines.length>0){var line=g_objLines[i];line.style.transform='rotate('+angle+'deg)';if(g_activeSegmentIndex==i)
g_objLines[i].classList.add(g_classActive)
else g_objLines[i].classList.remove(g_classActive)}}}
function drawSegments(){if(g_showSegments==!1)
return(!1);var objSegmentCircle=g_objInfographic.find(".uc-segment-circle");var colorInterval=360/g_objButtonsNumber;var skewDeg=90+colorInterval;var skewDegSeparator=90+colorInterval/2;var circleOuterWidth=Math.floor(objSegmentCircle.width());g_objSegmentSeparators.css({"width":circleOuterWidth+"px"});for(let i=0;i<=g_objButtonsNumber;i++){g_objSegments.eq(i).css({"transform":"rotate("+i*colorInterval+"deg) skewY("+skewDeg+"deg)",});g_objSegmentSeparators.eq(i).css({"transform":"rotate("+i*colorInterval+"deg) skewY("+skewDegSeparator+"deg)"})}
objSegmentCircle.css({"transform":"rotate("+colorInterval/2+"deg)"});var objButtonsWrapper=g_objInfographic.find(".uc-circle-wrapper");g_objButtons.insertBefore(objButtonsWrapper)}
function onSegmentClick(){var objSegment=jQuery(this);var objSegmentIndex=Math.floor(objSegment.index()/2);g_objButtons.eq(objSegmentIndex).trigger("click");g_objSegments.removeClass(g_classActive);objSegment.addClass(g_classActive)}
function onObjButtonClick(objCircleItem,objInnerContent){var itemID=objCircleItem.attr("id");var contentID="#"+itemID+"_content";var objContent=jQuery(contentID);objCircleItem.siblings("."+g_classSelected).removeClass(g_classSelected);objCircleItem.addClass(g_classSelected);objInnerContent.html(objContent.html());var activeIndex=objCircleItem.index();for(let i=0;i<g_objButtonsNumber;++i){if(g_objLines&&g_objLines.length>0){var line=g_objLines[i];if(activeIndex==i)
line.classList.add(g_classActive);else line.classList.remove(g_classActive)}}
if(g_showSegments==!1)
return(!1);g_activeSegmentIndex=objCircleItem.index();g_objSegments.removeClass(g_classActive);g_objSegments.eq(g_activeSegmentIndex).addClass(g_classActive)}
function onBodyClick(event){var closeOnBodyClick=g_objInfographic.data("close-body");if(closeOnBodyClick==!1)
return(!1);if(g_objInfographic.hasClass("uc-remote-parent")==!0)
return(!1);if(jQuery(event.target).closest(".ciclegraph").length)
return(!1);g_objInnerCircle.html(g_innerCircleHtml);g_objButtons.removeClass(g_classSelected);g_objSegments.removeClass(g_classActive)}
function onItemMouseover(){var dataTriggerType=g_objInfographic.data("trigger-type");if(dataTriggerType=="click")
return(!0);if(g_showSegments==!0)
return(!0);jQuery(this).trigger("click")}
function onSegmentMouseover(){var dataTriggerType=g_objInfographic.data("trigger-type");if(dataTriggerType=="click")
return(!0);if(g_showSegments==!1)
return(!0);jQuery(this).trigger("click")}
function onButtonFocus(objCircleItem){objCircleItem.trigger("click")}
this.refreshHtml=function(){g_objButtons.remove();g_objSegments.remove();g_objSegmentSeparators.remove();g_objInnerCircle.html(g_innerCircleHtml);g_objInfographic.removeClass(g_classOpacityFull)}
this.init=function(ueInfographicId){g_objInfographic=jQuery("#"+ueInfographicId);g_objButtons=g_objInfographic.find('.uc-circle');g_objSegments=g_objInfographic.find('.uc-segment');g_objSegmentSeparators=g_objInfographic.find(".uc-separator-outer");g_showSegments=g_objInfographic.data("show-segments");g_selectedItem=g_objInfographic.data("selecteditem");g_selectedItemNum=g_objInfographic.data("selecteditem-num");g_objLines=g_objInfographic.find(".center-line-wrapper");g_objButtonsNumber=g_objButtons.length;if(g_showSegments==!0)
g_objInnerCircle=g_objInfographic.find(".uc-segment-border-inner-circle");if(g_showSegments==!1)
g_objInnerCircle=g_objInfographic.find(".innerCircle");g_innerCircleHtml=g_objInnerCircle.html();g_classSelected="uc-circle-selected";g_classActive="active";g_classOpacityFull='uc-full-opacity';startInfographic();drawSegments();if(g_showSegments==!1)
setTimeout(openFirstItem,1100);if(g_showSegments==!0){if(g_selectedItem==!0)
g_objInnerCircle.html('');setTimeout(openFirstItem,100)}
g_objInfographic.addClass(g_classOpacityFull);g_objSegments.on('click',onSegmentClick);g_objSegments.on('mouseover',onSegmentMouseover);g_objButtons.on('click',function(){var objCircleItem=jQuery(this);onObjButtonClick(objCircleItem,g_objInnerCircle)});jQuery(window).on('resize',startInfographic);jQuery(document).on('click',function(event){onBodyClick(event)});g_objButtons.on('focus',function(){var objCircleItem=jQuery(this);onButtonFocus(objCircleItem)});g_objButtons.on('mouseover',onItemMouseover)}}