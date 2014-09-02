DAB.interludes.push(new DAB.Interlude({

  el: $('#last-words-interlude'),
  

  url: 'last-words.json',


  title: 'Last Words',
  subtitle: 'Final Statements of the Condemned in Texas',
  

  build: function (data) {
    var that = this;

    that.createSharedElements();

    var paragraphize = function (input) {
      input = '<p>' + input + '</p>';
      input.replace(/<br \/>/g, '</p><p>');
      return input;
    };

    var data = {
      "name": "words",
      "children": data
    };

    var pack = d3.layout.pack()
      .sort(null)
      .size([that.el.width(), that.el.height()])
      .value(function (d) { return d.count; });

    var nodes = pack.nodes(data);

    var fontScale = d3.scale.linear()
      .domain([
        d3.min(nodes[0].children, function (d) { return d.r; }),
        d3.max(nodes[0].children, function (d) { return d.r; })
      ])
      .range([8,60]); // hardcoded for reasons passing understanding.

    that.svg.selectAll('g.bubble-wrapper')
      .data(nodes)
      .enter()
      .append('g').attr('class', 'bubble-wrapper')
      .classed('parent', function (d) { return d.children ? true : false })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' });

    that.svg.selectAll('g.bubble-wrapper')
      .append('circle')
      .classed('bubble', true)
      .attr('r', function (d) { return d.r - 3 }); // hardcoded 3px padding.

    that.svg.selectAll('g.bubble-wrapper')
      .append('text')
      .text(function (d) { return d.word; })
      .style('font-size', function (d) { return fontScale(d.r) })
      .attr('transform', function (d) {
        var yPosition = fontScale(d.r) / 4;
        return 'translate(0,' + yPosition + ')';
      });

    that.svg.selectAll('g.bubble-wrapper').on('click', function (d) {
      var d3el = d3.select(this);
      
      // add blurs
      var defs = that.svg.append("defs");
      var filter = defs.append("filter")
        .attr("id", "bubble-blur");
      filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", 10);
      that.svg.selectAll('g.bubble-wrapper').attr('filter', 'url(#bubble-blur)');
      that.el.find('h1').addClass('blur');
      that.el.find('h2').addClass('blur');

      d3el.classed('active', true);
      that.el.append(
        '<div class="words-overlay">' +
          '<div class="words">' +
            '<button class="x"></button>' +
            '<h1>' + d.name + '</h1>' +
            paragraphize(d.statement) +
          '</div>' +
        '</div>'
      );
      that.el.find('.words-overlay').on('click', function (e) {
        that.svg.selectAll('g.bubble-wrapper').attr('filter', '');
        $(this).remove();
        d3el.classed('active', false);
        that.el.find('h1, h2').removeClass('blur');
      });
    });

  }
}));