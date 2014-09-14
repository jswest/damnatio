DAB.interludes.push(new DAB.Interlude({

  el: $('#how-we-kill-interlude'),



  url: 'how-we-kill.json',



  title: 'How We Kill',
  subtitle: 'Methods of Execution from 1776 to Present',



  build: function (data) {

    var that = this;

    that.createSharedElements();

    var sizes = {
      "width": that.el.width() - 88,
      "height": that.el.height() - 88,
      "top": 44,
      "left": 44
    };

    var colorIndex = {
      'lethal injection': 0,
      'electrocution': 1,
      'gas chamber': 2,
      'firing squad': 3,
      'hanging': 4,
      'other': 5
    };
    var keynames = {
      "method": [
        'lethal injection',
        'electrocution',
        'gas chamber',
        'firing squad',
        'hanging',
        'other'
      ]
    };
    var colors = [
      'rgb(255,149,207)',
      'rgb(255,0,174)',
      'rgb(255,207,149)',
      'rgb(255,174,0)',
      'rgb(149,207,255)',
      'rgb(0,174,255)'
    ];
    var color = d3.scale.ordinal()
      .domain([5,4,3,2,1,0])
      .range(colors)


    var createKey = function (sortKey) {
      if (that.el.find('table.key').length === 0) {
        that.el.append('<table class="key"></table>');
      }
      var keyel = that.el.find('table.key')
      keyel.html('');
      for (var i = 0; i < keynames[sortKey].length; i++) {
        keyel.append(
          '<tr>' +
            '<td style="background-color:' + color(i) + ';" class="colorblock"></td>' +
            '<td>' + keynames[sortKey][i] + '</td>' +
          '</tr>'
        );
      }
    };

    createKey('method');

    var xScale = d3.time.scale()
      .domain([new Date('1776'), new Date('2014')])
      .range([sizes.left, sizes.width]);

    var yScale = d3.scale.linear()
      .domain([200, 0])
      .range([sizes.top, sizes.height]);

    var oneYearsWidth = xScale(new Date('1778')) - xScale(new Date('1777'));

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(10)
    that.svg.append('g').attr('class', 'x-axis');
    that.svg.select('g.x-axis')
      .call(xAxis)
      .attr('transform', 'translate(0,' + (sizes.height + sizes.top) + ')')
      .selectAll('text')
      .attr('transform', 'translate(' + (oneYearsWidth / 2) + ',0)');

    var stack = d3.layout.stack()
    var stackedData = stack(data)

    var groups = that.svg.selectAll('g.layer')
      .data(stackedData)
      .enter()
      .append('g').classed('layer', true);

    var rects = groups.selectAll('rect')
      .data(function (d) { return d; })
      .enter()
      .append('rect')
      .attr('x', function (d) { return xScale(new Date(d.x)); })
      .attr('y', function (d) { return yScale(d.y0 + d.y); }) // magic
      .attr('height', function (d) { return yScale(d.y0) - yScale(d.y0 + d.y); }) // magic
      .attr('width', oneYearsWidth)
      .style('fill', function (d) { return color(colorIndex[d.method]); });

  }

}));