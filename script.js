// nifty function to dynamically inject <style> into <head>
function add_style_tag(rules) {
    var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        rulenode = document.createTextNode(rules);
        
    style.type = 'text/css';
    if(style.styleSheet)
        style.styleSheet.cssText = rulenode.nodeValue;
    else style.appendChild(rulenode);
    head.appendChild(style);
}

// main handler to parse the results and inject into the DOM
function insertResults(data){
  jQuery("#spinner").hide();
  jQuery("#tsr > ol.results").append("<li><h2>Top matching tweets</h2></li>");

  jQuery.each(data.results, function(i, result) {
      var r = "";
      r += "<li class='result'>";
      r += "<a target='_none' href='http://twitter.com/"+result.from_user+"'>"+"<strong>"+result.from_user+"</strong>"+"</a>";
      r += " ";
      r += result.text.replace(/(\bhttp[s]?\:\/\/.*?(\s|$))/ig, "<a target='_none' href='$1'>$1</a>").replace(/@(\w+)/g, "<a href='http://twitter.com/$1'>$&</a>");
      r += "<div class='timestamp'>"+result.created_at+"</div>";
      r += "</li>";

      jQuery("#tsr > ol.results").append(r);

      if (i==10) return false;
  });
};

function triggerSearch() {
  // inject custom style tag into header
  var rules = "";
  rules += "#res {float: left; width: 460px;}";
  rules += "#tsr {border-left: 1px solid rgb(201, 215, 241); padding-left: 10px; float: left; width: 250px;}";
  rules += "li.result {padding: 5px 10px 10px 5px;}"
  rules += "div.timestamp {color: #AAAAAA;}";
  add_style_tag(rules);

  // if #mbEnd already exists then remove it
  var mbEnd = document.getElementById("mbEnd");
  if (mbEnd) mbEnd.parentNode.removeChild(mbEnd);

  // Create new div for twitter search results and append before #res
  var tsr = "<div id='tsr'>"
    + "<ol class='results'>"
    + "<div id='spinner'><h2><img src='http://img413.imageshack.us/img413/8999/ajaxloaderbs5.gif' /> searching Twitter </h2></div>"
    + "</ol>"
    + "</div>";
  jQuery("#res").after(tsr);

  // grab the current search term
  var q = document.getElementsByName('q')[0].value.split(' ').join('+');

  // fire off the twitter feed request
  chrome.extension.sendRequest({'action' : 'fetchTwitterFeed', 'q': q}, insertResults);
}

// only perform twitter search for "web" google results
var everything_li = jQuery("#leftnav ul li:first");
console.log(everything_li);

if ( everything_li.hasClass('msel') ) {
  triggerSearch();
}

