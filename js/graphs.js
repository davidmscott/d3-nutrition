var dataTotal = [
  { label: 'Protein', count: 1, percent: 0 },
  { label: 'Carbohydrates', count: 1, percent: 0 },
  { label: 'Fat', count: 1, percent: 0 }
];
var caloriesTotal = 0;

function searchFood() {
  var search = $('#search').val();
  $('#search').val('');
  $.get('/nutrients', search, function(res) {

    var dataset = [
      { label: 'Protein', count: 1 },
      { label: 'Carbohydrates', count: 1 },
      { label: 'Fat', count: 1 }
    ];

    var calories = JSON.parse(res.body).calories;
    var foodMatch = JSON.parse(res.body).ingredients[0].parsed[0].foodMatch;
    var quantity = JSON.parse(res.body).ingredients[0].parsed[0].quantity;
    var measure = JSON.parse(res.body).ingredients[0].parsed[0].measure;
    var totalDaily = JSON.parse(res.body).totalDaily;
    dataset[0].percent = totalDaily.FAT ? totalDaily.FAT.quantity : 0;
    dataset[1].percent = totalDaily.CHOCDF ? totalDaily.CHOCDF.quantity : 0;
    dataset[2].percent = totalDaily.PROCNT ? totalDaily.PROCNT.quantity : 0;
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    var insideRadius = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;
    var foodDesc = '';
    if (quantity) {
      foodDesc += quantity + ' ';
    }
    if (measure) {
      foodDesc += measure + ' ';
    }
    if (foodMatch) {
      foodDesc += foodMatch;
    } else {
      foodDesc = '';
    }

    $('#chart').prepend('<h4>' + 'Calories: ' + calories + '</h4>');

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // var color = d3.scaleOrdinal()
    // 	.range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);

    var svg = d3.select('#chart')
      .insert('svg',':first-child')
      .attr('class', 'rounded')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(insideRadius)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var div = d3.select('#chart').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .style('opacity', 0)
      .attr('d', function(d, i) { return arc.outerRadius(insideRadius + Math.min(d.data.percent, 100))(d, i); })
      .attr('fill', function(d) {
        return color(d.data.label);
      })
      .on('mouseover', function(d) {
        div
          .transition()
          .duration(200)
          .style('opacity', 1);
        div
          .html(d.data.label + ': ' + d.data.percent.toFixed(1) + '%')
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
        // d3.select(this)
        // 	.style('fill', function(d){return d3.rgb(this.getAttribute('fill')).darker(0.3);});
        d3.select(this)
          .transition()
          .duration(1000)
          .ease(d3.easeBounceOut)
          .attr('d', function(d, i) { return arc.innerRadius(0.1 * (insideRadius + Math.min(d.data.percent, 100)) + insideRadius)(d, i); })
          .attr('d', function(d, i) { return arc.outerRadius(1.1 * (insideRadius + Math.min(d.data.percent, 100)))(d, i); });
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
        // d3.select(this)
        // 	.style('fill', function(d){return d3.rgb(this.getAttribute('fill')).brighter(0.3);});
        d3.select(this)
          .transition()
          .duration(1000)
          .ease(d3.easeBounceOut)
          .attr('d', function(d, i) { return arc.innerRadius(insideRadius)(d, i); })
          .attr('d', function(d, i) { return arc.outerRadius(insideRadius + Math.min(d.data.percent, 100))(d, i); });
      })
      .on('mousemove', function(d) {
        div
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px')
      });

    var svg2 = d3.select('#chart svg:first-of-type')
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc2 = d3.arc()
      .innerRadius(insideRadius + 100)
      .outerRadius(insideRadius + 110);

    var pie2 = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    path
      .transition()
      .duration(1000)
      .style('opacity', 1);

    svg
      .append('circle')
        .attr('r', insideRadius)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius - 10)
        .attr('x', -7)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('0%')
        .transition()
        .duration(4000)
        .style('opacity', 1);

    svg
      .append('circle')
        .attr('r', insideRadius + 50)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 40)
        .attr('x', -7 * 1.5)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('50%');

    svg
      .append('circle')
        .attr('r', insideRadius + 100)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 90)
        .attr('x', -7 * 2)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('100%');

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

    $('#chart').prepend('<h2>' + foodDesc + '</h2>').css('textTransform', 'capitalize');

    // var path2 = svg2.selectAll('path')
    // 	.data(pie2(dataset))
    // 	.enter()
    // 	.append('path')
    // 	.style('opacity', 0)
    // 	.attr('d', function(d, i) {
    // 		if (d.data.percent > 100) {
    // 				 return arc2.outerRadius(insideRadius + 110)(d, i);
    // 		}
    // 	})
    // 	.attr('fill', 'red');

    // path2
    // 	.transition()
    // 	.delay(1000)
    // 	.duration(1000)
    // 	.style('opacity', 1);

    dataTotal[0].percent += dataset[0].percent;
    dataTotal[1].percent += dataset[1].percent;
    dataTotal[2].percent += dataset[2].percent;

    $('#chartTotal').html('');

    color = d3.scaleOrdinal(d3.schemeCategory10);
    // var color = d3.scaleOrdinal()
    // 	.range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);

    svg = d3.select('#chartTotal')
      .insert('svg',':first-child')
      .attr('class', 'rounded')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    arc = d3.arc()
      .innerRadius(insideRadius)
      .outerRadius(radius);

    pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    div2 = d3.select('#chartTotal').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    path = svg.selectAll('path')
      .data(pie(dataTotal))
      .enter()
      .append('path')
      .style('opacity', 0)
      .attr('d', function(d, i) { return arc.outerRadius(insideRadius + Math.min(d.data.percent, 100))(d, i); })
      .attr('fill', function(d) {
        return color(d.data.label);
      })
      .on('mouseover', function(d) {
        div2
          .transition()
          .duration(200)
          .style('opacity', 1);
        div2
          .html(d.data.label + ': ' + d.data.percent.toFixed(1) + '%')
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).darker(0.3);})
      })
      .on('mouseout', function(d) {
        div2
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).brighter(0.3);})
      })
      .on('mousemove', function(d) {
        div2
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px')
      });

    path
      .transition()
      .delay(1000)
      .duration(1000)
      .style('opacity', 1);

    svg
      .append('circle')
        .attr('r', insideRadius)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius - 10)
        .attr('x', -7)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('0%');

    svg
      .append('circle')
        .attr('r', insideRadius + 50)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 40)
        .attr('x', -7 * 1.5)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('50%');

    svg
      .append('circle')
        .attr('r', insideRadius + 100)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 90)
        .attr('x', -7 * 2)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('100%');

    legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

    caloriesTotal += calories;

    $('#chartTotal').prepend('<h2>' + 'Total Daily Amounts' + '</h2>');
    $('#chartTotal').append('<h4>' + 'Calories: ' + caloriesTotal + '</h4>');

    svg2 = d3.select('#chartTotal svg:first-of-type')
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    path2 = svg2.selectAll('path')
      .data(pie2(dataTotal))
      .enter()
      .append('path')
      .style('opacity', 0)
      .attr('d', function(d, i) {
        if (d.data.percent > 100) {
             return arc2.outerRadius(insideRadius + 110)(d, i);
        }
      })
      .attr('fill', 'red')
      .on('mouseover', function(d) {
        div2
          .transition()
          .duration(200)
          .style('opacity', 1);
        div2
          .html('Exceeded recommended daily ' + d.data.label + ' limit')
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).darker(0.3);})
      })
      .on('mouseout', function(d) {
        div2
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).brighter(0.3);})
      })
      .on('mousemove', function(d) {
        div2
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px')
      });;

    path2
      .transition()
      .delay(2000)
      .duration(1000)
      .style('opacity', 1);
  });
}
