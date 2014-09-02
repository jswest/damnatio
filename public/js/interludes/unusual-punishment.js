DAB.interludes.push(new DAB.Interlude({


  el: $('#unusual-punishment-interlude'),
  url: 'unusual-punishment.json',
  title: 'unusual punishment',
  subtitle: 'how a small minority of counties account for the vast majority of executions',

  build: function (data) {
    var that = this;

    // TODO move this to the interludes.js file
    var c = d3.scale.ordinal()
    .domain([0,1,2,3,4])
    .range([
      'rgb(70,62,64)',
      'rgb(68,70,79)',
      'rgb(58,86,106)',
      'rgb(37,117,159)',
      'rgb(0,174,255)'
    ]);

    var range = function (input) {
      if (!input || input === "false" || input === 0) {
        return 0;
      } else if (input <= 1) {
        return 1;
      } else if (input <= 10) {
        return 2;
      } else if (input <= 50) {
        return 3;
      } else {
        return 4;
      }
    };

    // the key
    el.append(
      '<table class="key">' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>0 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>1 execution</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>2 to 10 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>11 to 49 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>50 or more executions</td>' +
        '</tr>' +
      '</table>'
    );
    var table = el.find('table.key');
    for (var i = 0; i < table.find('td.colorblock').length; i++) {
      table.find('td.colorblock').eq(i).css('background-color', c(i));
    }
    


    var projection = d3.geo.albersUsa()
      .scale($(window).width() + 300)
      .translate([that.el.width() / 2, that.el.height() / 2]);
    var path = d3.geo.path()
      .projection(projection);


    that.svg.append('g').attr('class', 'counties')
      .selectAll("path.county")
      .data(topojson.feature(topology, topology.objects.counties).features)
      .enter()
      .append("path")
      .attr('id', function (d) {
        return "fips-" + d.id;
      })
      .attr("d", path)
      .attr('class', function (d) {
        if (d.properties.count !== "false" && d.properties.count > 0) {
          return 'executioner';
        }
      })
      .classed("county", true)
      .style('fill', function (d) {
        return c(range(d.properties.count));
      });
    svg.append('g').attr('class', 'states')
      .selectAll('path.state')
      .data(topojson.feature(topology, topology.objects.states).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', function (d) {
        return 'fips-' + d.id;
      })
      .classed('state', true);
    $('.executioner')
      .css('cursor', 'pointer')
      .on('mouseover', function (e) {
        var d = d3.select(this).datum();
        if (d.properties.count !== "false" && d.properties.count > 0) {
          console.log(d.properties)
          var name  = d.properties.county
          ,   count = d.properties.count
          ,   state = d.properties.state;
          if (el.find('.inspector').length === 0) {
            el.append(
              '<ul class="inspector">' +
                  '<li>' + name + '</li>' +
                  '<li>' + count + ' executions</li>' +
              '</ul>'
            );
          } else {
            var inspector = that.el.find('.inspector');
          }
          var inspector = that.el.find('.inspector');
          inspector.css({
            'top': e.clientY - that.el.offset().top - 100,
            'left': e.clientX - that.el.offset().left - (inspector.width() / 2)
          })
        }
      })
      .on('mouseout', function (e) {
        that.el.find('.inspector').remove();
      })



  }


}));