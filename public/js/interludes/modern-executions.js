DAB.interludes.push(new DAB.Interlude({

  el: $('#modern-executions-interlude'),


  url: 'modern-executions.json',


  title: 'Modern Executions',
  subtitle: 'A look at executions from 1977 to present',


  build: function (data) {
    var that = this;

    var sortKey = 'race';

    var sizes = {
      "width": that.el.width() - 88,
      "height": that.el.height() - 88,
      "top": 44,
      "left": 44
    }

    var createControls = function () {
      that.el.append(
        '<ul class="controls">' +
          '<li class="control" data-sort-key="method">method</li>' +
          '<li class="control" data-sort-key="region">region</li>' +
          '<li class="control active" data-sort-key="race">race</li>' +
          '<li class="control" data-sort-key="juvenile">juvenile</li>' +
          '<li class="control" data-sort-key="sex">sex</li>' +
        '</ul>'
      );
    };

    var keys = {
      "race": {
        "white": {
          "nicename": "white",
          "colorIndex": 0
        },
        "black": {
          "nicename": "black",
          "colorIndex": 1
        },
        "latino": {
          "nicename": "latino",
          "colorIndex": 2
        },
        "native american": {
          "nicename": "native american",
          "colorIndex": 3
        },
        "asian": {
          "nicename": "asian",
          "colorIndex": 4
        },
        "other": {
          "nicename": "other",
          "colorIndex": 5
        }
      },
      "method": {
        "lethal injection": {
          "nicename": "lethal injection",
          "colorIndex": 0
        },
        "electrocution": {
          "nicename": "electrocution",
          "colorIndex": 1
        },
        "gas chamber": {
          "nicename": "gas chamber",
          "colorIndex": 2
        },
        "firing squad": {
          "nicename": "firing squad",
          "colorIndex": 3
        },
        "hanging": {
          "nicename": "hanging",
          "colorIndex": 4
        }
      },
      "region": {
        "s": {
          "nicename": "south",
          "colorIndex": 0
        },
        "n": {
          "nicename": "northeast",
          "colorIndex": 1
        },
        "m": {
          "nicename": "midwest",
          "colorIndex": 2
        },
        "w": {
          "nicename": "west",
          "colorIndex": 3
        }
      },
      "sex": {
        "m": {
          "nicename": "male",
          "colorIndex": 0
        },
        "f": {
          "nicename": "female",
          "colorIndex": 1
        }
      },
      "juvenile": {
        "no": {
          "nicename": "adult",
          "colorIndex": 0
        },
        "yes": {
          "nicename": "juvenlie",
          "colorIndex": 1
        }
      }
    };

    var sort = function (data, sortKey) {
      return data.sort(function (a, b) {
        return keys[sortKey][a[sortKey]].colorIndex > keys[sortKey][b[sortKey]].colorIndex ? 1 : -1;
      });
    };

    var year = function (date) {
      return new Date(date.split('/')[2] + '-01-01');
    };

    var create = function (sortKey) {
      createKey(sortKey);
      var indices = {};
      rect
        .attr('transform', function (d, i) {
          var xpos = x(year(d.date));
          var ypos = sizes.height + sizes.top;
          return 'translate(' + xpos + ',' + ypos + ')';
        })
        .transition()
        .delay(500)
        .duration(700)
        .attr('width', oneYearsWidth - 1)
        .attr('height', h(1) - 1)
        .attr('transform', function (d, i) {
          var date = year(d.date).toString();
          indices[date] = indices[date] ? indices[date] + 1 : 1;
          var xpos = x(year(d.date))
          ,   ypos = y(indices[date]);
          return 'translate(' + xpos + ',' + ypos + ')';
        })
        .style('fill', function (d, i) { return color(keys[sortKey][d[sortKey]].colorIndex); });
      that.el.find('rect')
        .on('mouseover', function (e) {
          var d = d3.select(this).datum();
          var name    = d.name
          ,   method  = d.method
          ,   race    = d.race
          ,   sex     = d.sex 
          ,   state   = d.state;
          if (that.el.find('.inspector').length === 0) {
            that.el.append(
              '<table class="inspector">' +
                '<tr>' +
                  '<th>name</th>' +
                  '<td class="inspector-name">' + name + '</td>' + 
                '</tr>' +
                '<tr>' +
                  '<th>method</th>' +
                  '<td class="inspector-method">' + method + '</td>' + 
                '</tr>' +
                '<tr>' +
                  '<th>race</th>' +
                  '<td class="inspector-race">' + race + '</td>' + 
                '</tr>' +
                '<tr>' +
                  '<th>sex</th>' +
                  '<td class="inspector-sex">' + sex + '</td>' + 
                '</tr>' +
                '<tr>' +
                  '<th>state</th>' +
                  '<td class="inspector-state">' + state + '</td>' + 
                '</tr>' +
              '</table>'
            );
          } else {
            var inspector = that.el.find('.inspector');
          }
          var inspector = that.el.find('.inspector');
          
          if (e.clientY - that.el.offset().top > $(window).height() / 2) {
            var transformAmount = -inspector.height() - 20;
          } else {
            var transformAmount = 20;
          }

          inspector.css({
            'top': e.clientY - that.el.offset().top + 20 + transformAmount,
            'left': e.clientX - that.el.offset().left - (inspector.width() / 2)
          });
        })
        .on('mouseout', function (e) {
          that.el.find('.inspector').remove();
        });
    };


    that.createSharedElements();

    // Define the min and max values in order to create scales.
    var minx = d3.min(data, function (d) { return year(d.date); })
    ,   maxx = new Date('2015')
    ,   miny = 0
    ,   maxy = 100;

    // Define the scales.
    var x   = d3.time.scale()
      .domain([minx, maxx])
      .range([sizes.left, sizes.left + sizes.width])
    ,   y   = d3.scale.linear()
      .domain([maxy, miny])
      .range([sizes.top, sizes.top + sizes.height])
    ,   h   = d3.scale.linear()
      .domain([miny, maxy])
      .range([0, sizes.height])
    , color = d3.scale.ordinal()
      .domain([5,4,3,2,1,0])
      .range([
        'rgb(255,149,207)',
        'rgb(255,0,174)',
        'rgb(255,207,149)',
        'rgb(255,174,0)',
        'rgb(149,207,255)',
        'rgb(0,174,255)'        
      ]);

    // Get the width of one year, in order to create the right size bars.
    var oneYearsWidth = x(new Date('2014')) - x(new Date('2013'));


    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10)
      .tickSize(-sizes.width)
    that.svg.append('g').attr('class', 'y-axis')
    that.svg.select('g.y-axis')
      .call(yAxis)
      .attr('transform', 'translate(44,0)');


    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(10)
    that.svg.append('g').attr('class', 'x-axis')
    that.svg.select('g.x-axis')
      .call(xAxis)
      .attr('transform', 'translate(0,' + (sizes.height + sizes.top) + ')')
      .selectAll('text')
      .attr('transform', 'translate(' + (oneYearsWidth / 2) + ',0)');


    var rect = that.svg.selectAll('rect')
      .data(sort(data, sortKey))
      .enter()
      .append('rect');


    // Define a function that will create the chart key.
    var createKey = function (sortKey) {
      if (that.el.find('table.key').length === 0) {
        that.el.append('<table class="key"></table>');
      }
      var keyel = that.el.find('table.key')
      keyel.html('');
      var segments = _.keys(keys[sortKey]);
      for (var i = 0; i < segments.length; i++) {
        keyel.append(
          '<tr>' +
            '<td style="background-color:' + color(keys[sortKey][segments[i]].colorIndex) + ';" class="colorblock"></td>' +
            '<td>' + keys[sortKey][segments[i]].nicename + '</td>' +
          '</tr>'
        );
      }
    };


    var update = function (sortKey) {
      createKey(sortKey);
      var indices = {};
      rect
        .transition()
        .duration(500)
        .attr('transform', function (d, i) {
          var xpos = x(year(d.date));
          var ypos = sizes.height + sizes.top;
          return 'translate(' + xpos + ',' + ypos + ')';
        })
      rect
        .data(sort(data, sortKey))
        .transition()
        .delay(500)
        .duration(100)
        .attr('transform', function (d, i) {
          var xpos = x(year(d.date));
          var ypos = sizes.height + sizes.top;
          return 'translate(' + xpos + ',' + ypos + ')';
        })
        .transition()
        .delay(600)
        .duration(500)
        .attr('transform', function (d, i) {
          var date = year(d.date).toString(); 
          if ( indices[date] ) {
            indices[date]++;
          }
          else {
            indices[date] = 1;
          }
          var xpos = x(year(d.date));
          var ypos = y(indices[date]);
          return 'translate(' + xpos + ',' + ypos + ')';
        })
        .style( 'fill', function (d, i) { return color(keys[sortKey][d[sortKey]].colorIndex); } );
    };


    createControls();
    that.el.find('.control').on('click', function (e) {
      if (!$(this).hasClass('active')) {
        that.el.find('.control').removeClass('active');
        $(this).addClass('active');
        var newSortKey = $(this).data('sort-key');
        update(newSortKey);          
      }   
    });

    create(sortKey);
  }

}));