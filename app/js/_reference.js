/**
 * Created by nikolaialeksandrenko on 2/17/14.
 */

"use strict";

define([
  'angular',
  'graphModelerApp',
  'jquery',
  'd3'
], function (angular, app, $, d3) {

  app.controller('SVGCtrl', function ($scope, dataService) {

    //is set to true when the mouse buttoangular.module('app')n is down on the clean svg
    $scope.readyToDrag = false;
    //zoomlevel is not used
    $scope.zoomLevel = 1;
    $scope.graphTranslate = [0, 0];

    $scope.nodes = dataService.nodes;
    $scope.edges = dataService.edges;

    $scope.rightClick = {
      x: 0,
      y: 0,
      target: {
        _type: undefined,
        _uid: undefined,
        label: undefined
      }
    };

    //the selected svg
    var globalGroupClass = 'graph';
    var svg = d3.select('svg');
    var defaultColor = '#15c8c7';
    var backgroundColor = '#ebebeb'
    var opacityForNotSelectedEdgesAndNodes = 0.1;

    $scope.init = function () {
      initSvgElements();

      //it's used for moving the global 'g' around
      var zoom = d3.behavior.zoom()
        .on("zoom", function () {
          if ($scope.readyToDrag) {
            $scope.graphTranslate = d3.event.translate;
            setZoomAndTranslation();

            d3.event.sourceEvent.stopPropagation();
          }
        });
      var svg = d3.select("svg").call(zoom);

      svg.on("click", svgClickHandler);
      svg.on("contextmenu", contextClickHandler);
      svg.on("mousedown", svgMouseDownHandler);
      //d3.select("body").on("keydown", keydownHandler);
    }

    //the event is fired by the propertiesController
    $scope.$on('labelChanged', function (event, item) {
      updateSvgItemLabel(item);
    });

    //the event is fired by the propertiesController
    $scope.$on('colorChanged', function (event, item) {
      updateSvgEdges();
      updateSvgNodes();
    });

    function createUid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    //is used for moving the graph around
    function setZoomAndTranslation() {
      getGlobalSvgGroup().attr("transform", "translate(" + $scope.graphTranslate + "), scale(" + $scope.zoomLevel + ")");
    }

    //it is used for setting che correct opacity on an edge when a node is selected
    function isRelatedNodSelected(node) {
      if (node.isSelected) {
        return false;
      }

      //loop through all edges and check if the current edge start of finish to the selected node
      for (var i = 0; i < $scope.edges.length; i++) {
        if ($scope.edges[i].startNode._uid === node._uid || $scope.edges[i].endNode._uid === node._uid) {
          if ($scope.edges[i].startNode.isSelected || $scope.edges[i].endNode.isSelected) {
            return true;
          }
        }
      }

      return false;
    }

    function getNodeAndIndexByUID(_uid) {
      for (var i = 0; $scope.nodes.length; i++) {
        if ($scope.nodes[i]._uid === _uid) {
          return {
            index: i,
            node: $scope.nodes[i]
          }
        }
      }
    }

    function getEdgeAndIndexByUID(_uid) {
      for (var i = 0; $scope.edges.length; i++) {
        if ($scope.edges[i]._uid === _uid) {
          return {
            index: i,
            edge: $scope.edges[i]
          }
        }
      }
    }

    //right mouse click handled
    function contextClickHandler(data, index) {
      var position = d3.mouse(this);

      //create new node
      var x = position[0];
      var y = position[1];

      //set last right click data
      $scope.rightClick.x = x;
      $scope.rightClick.y = y;

      var type = getTargetGroupType();
      var uid = getTargetGroupUID();
      var label = undefined;

      if (type) {
        if (type === 'node') {
          label = getNodeAndIndexByUID(uid).node.label;
        }
        else if (type === 'edge') {
          label = getEdgeAndIndexByUID(uid).edge.label;
        }
      }
      $scope.rightClick.target._type = type;
      $scope.rightClick.target._uid = uid;
      $scope.rightClick.target.label = label;

      // apply so data can be used in the html
      $scope.$apply();
      // end of last right click data

      var contextMenuOffset = 10;
      var contextMenu = $('.contextMenu');

      x += contextMenuOffset;
      y += contextMenuOffset;
      contextMenu.css({left: x, top: y}).show();

      d3.event.preventDefault();
    }

    // it's fired by views/index.html ng-click
    $scope.contextMenuAddNodeClickHandler = function () {
      $('.contextMenu').hide();
      //correcting the x and y according the translation
      var x = $scope.rightClick.x - $scope.graphTranslate[0];
      var y = $scope.rightClick.y - $scope.graphTranslate[1];

      addNode(x, y);

      createSvgNodes();
      updateSvgNodes();
    }

    // it's fired by views/index.html ng-click
    $scope.contextMenuDeleteNodeClickHandler = function () {
      $('.contextMenu').hide();

      var uid = $scope.rightClick.target._uid;
      var type = $scope.rightClick.target._type;

      if (type == 'node') {
        removeNode(uid);
      }
      else if (type == 'edge') {
        removeEdge(uid);
      }
    }

    // it's fired by views/index.html ng-click
    $scope.contextMenuAddEdgeClickHandler = function () {

      if ($scope.rightClick.target._type == 'node') {
        var startNode = getNodeAndIndexByUID($scope.rightClick.target._uid).node;

        d3.select('svg path.dragline').classed('hidden', false);
        //add cursor hiding class to the body
        d3.select('body').classed('hidecursor', true);

        svg.on("mousemove", function (d) {
          d3.select('svg .dragline').attr({
            d: function () {
              var endX = d3.event.x - 5;
              var endY = d3.event.y - 5;
              //start x and y with translate compensation
              var startX = (startNode._location.x + $scope.graphTranslate[0]);
              var startY = (startNode._location.y + $scope.graphTranslate[1]);
              return 'M' + startX + ' ' + startY + ' L ' + endX + ' ' + endY;
            }
          });
        });

        d3.select('body').on("mousedown", function (d) {
          var endNodeUid = getTargetGroupUID();
          var targetType = getTargetGroupType();

          if (endNodeUid && targetType == 'node') {
            var endNode = getNodeAndIndexByUID(endNodeUid).node;
            addEdge(startNode, endNode);

            updateSvg();
          }

          hideContextMenuUnselectItemAndStopCreatingEdge();
        });
      }

      $('.contextMenu').hide();
    }

//    function keydownHandler() {
//      var escKey = 27;
//      var leftKey = 37;
//      var topKey = 38;
//      var rightKey = 39;
//      var bottomKey = 40;
//
//      switch (d3.event.keyCode) {
//        case escKey:
//          hideContextMenuUnselectItemAndStopCreatingEdge();
//          break;
//        case leftKey:
//          $scope.graphTranslate[0] -= 10;
//          setZoomAndTranslation();
//          break;
//        case topKey:
//          $scope.graphTranslate[1] -= 10;
//          setZoomAndTranslation();
//          break;
//        case rightKey:
//          $scope.graphTranslate[0] += 10;
//          setZoomAndTranslation();
//          break;
//        case bottomKey:
//          $scope.graphTranslate[1] += 10;
//          setZoomAndTranslation();
//          break;
//      }
//    }

    // set the context to - drag the graph around
    function svgMouseDownHandler() {
      if (isEventTargetTheSvg()) {
        //mark graph ready to be moved by the zoom event
        svg.classed('dragCursor', true);
        $scope.readyToDrag = true;

        svg.on("mouseup", function () {
          svg.on("mouseup", null);
          $scope.readyToDrag = false;
          svg.classed('dragCursor', false);
        });
      } else {
        svg.on("mouseup", null);
        $scope.readyToDrag = false;
      }
    }

    // handle hiding svg element, context menu, selected nodes/edges ...
    function hideContextMenuUnselectItemAndStopCreatingEdge() {
      //unselect selected svg node or edge;
      d3.select('.selectedSvg').classed("selectedSvg", false);

      //deselected selected edge or node
      deselectSvg();

      //hide the context menu
      $('.contextMenu').hide();

      //stop drawing the dragging line for edge creating
      //remove events
      svg.on("mousemove", null);
      d3.select('body').on("mousedown", null);

      //hide path
      d3.select('svg path.dragline')
        .attr({d: 'M0,0L0,0'})
        .classed('hidden', true);

      // remove the hiding cursor class from the body
      d3.select('body').classed('hidecursor', false);
    }

    // svg clicked handler
    function svgClickHandler() {
      if (isEventTargetTheSvg()) {
        hideContextMenuUnselectItemAndStopCreatingEdge();
      }
    }

    function getTargetGroupUID() {
      return $(d3.event.target).parent('g').attr('_uid');
    }

    function getTargetGroupType() {
      var type = $(d3.event.target).parent('g').attr('class');

      //clean class name from selectedSVG style if target is selected svg
      if (type) {
        type = type.replace("selectedSvg", "").replace(" ", "");
      }

      return type;
    }

    //checks if the clicked target is the <svg> tag or is some node or edge
    function isEventTargetTheSvg() {
      var target = $(d3.event.target);
      return (target.attr('id') == 'svg');
    }

    function getSelectedNode() {
      for (var i = 0; i < $scope.nodes.length; i++) {
        if ($scope.nodes[i].isSelected) {
          return $scope.nodes[i];
        }
      }

      return undefined;
    }

    function getSelectedEdge() {
      //deselect selected edge;
      for (var i = 0; i < $scope.edges.length; i++) {
        if ($scope.edges[i].isSelected) {
          return $scope.edges[i];
        }
      }

      return undefined;
    }

    function deselectSelectedNodeSVG() {
      var selectedNode = getSelectedNode();
      if (selectedNode) {
        selectedNode.isSelected = undefined;
      }
    }

    function deselectSelectedEdgeSVG() {
      var selectedEdge = getSelectedEdge();
      if (selectedEdge) {
        selectedEdge.isSelected = undefined;
      }
    }

    //click handler for d3 created svgs
    function selectSVG(item) {
      deselectSelectedNodeSVG();
      deselectSelectedEdgeSVG();

      item.isSelected = true;

      //redraw the edges and nodes fo the change is visible
      updateSvgEdges();
      updateSvgNodes();

      dataService.selectItem(item);
    }

    function deselectSvg() {

      deselectSelectedNodeSVG();
      deselectSelectedEdgeSVG();

      dataService.deselectItem();

      updateSvg();
    }

    // create node - only the object not the svg
    function addNode(x, y, label) {
      var newNode = {
        _location: {
          x: parseInt(x) || 0,
          y: parseInt(y) || 0
        },
        label: label || "DefaultLabel",
        properties: [],
        _color: defaultColor,
        _type: 'node',
        _uid: createUid()
      };

      $scope.nodes.push(newNode);
    };

    function removeNode(uid) {
      var nodeAndIndex = getNodeAndIndexByUID(uid);
      $scope.nodes.splice(nodeAndIndex.index, 1);

      // remove edges connected to this node
      for (var i = 0; i < $scope.edges.length; i++) {
        if ($scope.edges[i].startNode._uid == uid || $scope.edges[i].endNode._uid == uid) {
          removeEdge($scope.edges[i]._uid);
          i--;
        }
      }

      deselectSvg();
    };

    function removeEdge(uid) {
      var indexAndEdge = getEdgeAndIndexByUID(uid);
      $scope.edges.splice(indexAndEdge.index, 1);

      deselectSvg();
    };

    // add only the object for the edge
    function addEdge(startNode, endNode, label) {
      var middleX = (startNode._location.x + endNode._location.x) / 2;
      var middleY = (startNode._location.y + endNode._location.y) / 2;

      var newEdge = {
        startNode: startNode,
        endNode: endNode,
        middlePoint: {
          x: middleX,
          y: middleY
        },
        label: label || 'DefaultLabel',
        properties: [],
        _snappedToMiddle: true,
        _type: 'edge',
        _uid: createUid()
      };

      if (startNode === endNode) {
        newEdge.middlePoint.y += 60;
        newEdge.middlePoint.x -= 80;
      }

      $scope.edges.push(newEdge);
    };

    var utils = {

      // function for creating darken hex color
      darkenColor: function (color, percent) {
        percent = -percent;
        color = color.replace('#', '');

        var num = parseInt(color, 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
      },

      // calculating the vector length
      vectorSize: function (vec) {
        return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
      },

      // generates the svg path for the edge depending on the middle point
      getEdgePath: function (edge) {
        var path = '';

        var startX = edge.startNode._location.x;
        var endX = edge.endNode._location.x;
        var startY = edge.startNode._location.y;
        var endY = edge.endNode._location.y;

        if (edge.startNode === edge.endNode) {

          //calculating right and left point to curve the path
          var dist = 30;
          var start = edge.startNode._location;
          var end = edge.middlePoint;

          var pc = {
            x: start.x - end.x,
            y: start.y - end.y
          };

          var perpPC = {
            x: -pc.y,
            y: pc.x
          };

          //norm the perpPC
          perpPC.x /= utils.vectorSize(perpPC);
          perpPC.y /= utils.vectorSize(perpPC);

          var vectEnd = {
            x: perpPC.x * dist,
            y: perpPC.y * dist
          };

          var leftPoint = {
            x: end.x + vectEnd.x,
            y: end.y + vectEnd.y
          };

          var rightPoint = {
            x: end.x - vectEnd.x,
            y: end.y - vectEnd.y
          };
          //end of calculation

          var middlePoint = getEdgeMiddlePoint(edge);

          path = 'M ' + startX + ' ' + endY +
            'Q ' + leftPoint.x + ' ' + leftPoint.y + ' ' +
            middlePoint.x + ' ' + middlePoint.y +
            'Q ' + rightPoint.x + ' ' + rightPoint.y + ' ' +
            endX + ' ' + endY;

        } else {

          if (edge._snappedToMiddle) {
            path = "M " + startX + ' ' + startY + ' ' + endX + ' ' + endY;
          }

          else {
            var curveIndex = 30;
            var startCurv = {};
            startCurv.x = startX < endX ? edge.middlePoint.x - curveIndex : edge.middlePoint.x + curveIndex;
            startCurv.y = startY < endY ? edge.middlePoint.y - curveIndex : edge.middlePoint.y + curveIndex;

            var endCurv = {};
            endCurv.x = startX > endX ? edge.middlePoint.x - curveIndex : edge.middlePoint.x + curveIndex;
            endCurv.y = startY > endY ? edge.middlePoint.y - curveIndex : edge.middlePoint.y + curveIndex;

            path = "M " + startX + ' ' + startY +
              ' Q ' + startCurv.x + ' ' + startCurv.y +
              ' ' + edge.middlePoint.x + ' ' + edge.middlePoint.y +
              ' Q ' + endCurv.x + ' ' + endCurv.y +
              ' ' + endX + ' ' + endY;
          }
        }

        return path;
      }
    };

    // calculates the position of the edge's middle point
    // it's used for the position of the edge's label and ...
    function getEdgeMiddlePoint(edge) {
      var middlePoint = {
        x: (edge.startNode._location.x + edge.endNode._location.x) / 2,
        y: (edge.startNode._location.y + edge.endNode._location.y) / 2
      };

      if (edge.startNode === edge.endNode) {
        middlePoint.x = edge.middlePoint.x;
        middlePoint.y = edge.middlePoint.y;
      }

      return middlePoint;
    }

    // each edge need to have it's own arrow for pointing,
    // so you can set different colors and opacities when selecting nodes and the edge itself
    function createSvgMarkerForEdge(edge) {

      if (getArrowById(edge._uid).empty() === false) {
        return;
      }

      var defs = svg.select('.arrows');

      defs.append('svg:marker')
        .attr('fill', edge.startNode._color)
        .attr('class', 'end-arrow')
        .attr('id', 'end-arrow-' + edge._uid)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', "21")
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');
    }

    // start creating the svg elements
    function initSvgElements() {
      //create one global group for all the svg's - so the whole graph can be moved around
      var svgG = svg.append("g").classed(globalGroupClass, true);

      // create global svg parent element for all arrows
      var defs = svgG.append('svg:defs').attr({
        class: 'arrows'
      });

      // define arrow marker for leading arrow when creating new rel;
      defs.append('svg:marker')
        .attr('id', 'mark-end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 7)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

      //drag line, add this svg to the parent svg so line can be drawen outside the global g
      svg.append('path')
        .attr('class', 'dragline hidden')
        .attr({
          d: 'M0,0L0,0',
          stroke: 'black'
        })
        .style('marker-end', 'url(#mark-end-arrow)');

      updateSvg();
    }

    function updateSvg() {
      createSvgEdges();
      updateSvgEdges();

      createSvgNodes();
      updateSvgNodes();
    }

    function updateSvgItemLabel(item) {
      var svgText = getGlobalSvgGroup().select('[_uid="' + item._uid + '"]').select('text');
      svgText.text(item.label);
    }

    function createSvgEdges() {
      getGlobalSvgGroup().selectAll("g.edge").remove();

      var edge = getGlobalSvgGroup().selectAll("g.edge").data($scope.edges);

      var svgEdges = edge.enter().append("g").attr({
        class: "edge",
        _uid: function (edge) {
          //create end arrow for the edge
          createSvgMarkerForEdge(edge);
          return edge._uid;
        }
      });

      svgEdges.append('path')
        .attr({
          stroke: 'black',
          style: function (edge) {
            return 'marker-end: url(#end-arrow-' + edge._uid + ')'
          }
        });

      svgEdges.append('text')
        .text(function (edge) {
          return edge.label
        })
        .attr({
          fontSize: '15'
        }).on("click", selectSVG)
        .call(d3.behavior.drag().on("drag", function (edge) {
          var proximity = 15;
          var x = d3.event.x;
          var y = d3.event.y;

          var middlePoint = getEdgeMiddlePoint(edge);

          var vectorLength = Math.sqrt(Math.pow(middlePoint.x - x, 2) + Math.pow(middlePoint.y - y, 2));
          //toggle snapToMiddle According the proximity of the middle point;
          edge._snappedToMiddle = vectorLength < proximity;

          edge.middlePoint.x = x;
          edge.middlePoint.y = y;

          d3.event.sourceEvent.stopPropagation();
          updateSvgEdges();
        }));
    }

    function createSvgNodes() {
      getGlobalSvgGroup().selectAll("g.node").remove();

      var node = getGlobalSvgGroup().selectAll("g.node").data($scope.nodes);
      var svgNodes = node.enter().append("g").attr({
        class: 'node',
        _uid: function (node) {
          return node._uid;
        }
      });

      svgNodes.append('circle')
        .attr({
          r: 12
        })
        .on('click', selectSVG)
        .call(d3.behavior.drag().on("drag", function (node) {

          //get all edges that start and ends with this node and move them with the node (recalculate the middle point)
          for (var r = 0; r < $scope.edges.length; r++) {
            if ($scope.edges[r].startNode === node && $scope.edges[r].endNode === node) {

              var distanceX = $scope.edges[r].middlePoint.x - node._location.x;
              var distanceY = $scope.edges[r].middlePoint.y - node._location.y;

              $scope.edges[r].middlePoint.x = d3.event.x + distanceX;
              $scope.edges[r].middlePoint.y = d3.event.y + distanceY;
            }
          }

          node._location.x = d3.event.x;
          node._location.y = d3.event.y;

          d3.event.sourceEvent.stopPropagation();

          //this are fired on node/edge drag so they are redrawen
          updateSvgNodes();
          updateSvgEdges();
        }));

      svgNodes.append('text')
        .text(function (node) {
          return node.label
        });
    }

    function updateSvgEdges() {
      var svgEdges = getGlobalSvgGroup().selectAll("g.edge");

      svgEdges.select('path').attr({
        'stroke-opacity': function (edge) {
          var edgeArrow = getArrowById(edge._uid);

          if (getSelectedNode()) {
            if (edge.startNode.isSelected || edge.endNode.isSelected) {
              edgeArrow.style('fill-opacity', 1);
            } else {
              edgeArrow.style('fill-opacity', opacityForNotSelectedEdgesAndNodes);
            }

            return (edge.startNode.isSelected || edge.endNode.isSelected) ? 1 : opacityForNotSelectedEdgesAndNodes;
          } else {
            //no selected node
            edgeArrow.style('fill-opacity', 1);
          }
          return '1';
        },
        stroke: function (edge) {
          //change edge's arrow color
          getArrowById(edge._uid).style('fill', edge.startNode._color);

          if (edge.isSelected) {
            return utils.darkenColor(edge.startNode._color, 20);
          }

          return edge.startNode._color || defaultColor;
        },
        'stroke-width': function (edge) {
          return 2;
        },
        d: function (edge) {
          return utils.getEdgePath(edge);
        }
      });

      svgEdges.select('text').attr({
        'fill-opacity': function (edge) {
          if (getSelectedNode()) {
            return (edge.startNode.isSelected || edge.endNode.isSelected) ? 1 : opacityForNotSelectedEdgesAndNodes;
          }

          return '1';
        },
        fill: function (edge) {
          if (edge.isSelected) {
            return utils.darkenColor(edge.startNode._color, 20);
          }

          return edge.startNode._color || defaultColor;
        },
        stroke: function (edge) {
          if (edge.isSelected) {
            return utils.darkenColor(edge.startNode._color, 20);
          }

          return 0;
        },
        x: function (edge) {
          if (edge._snappedToMiddle) {
            edge.middlePoint = getEdgeMiddlePoint(edge);
          }
          return edge.middlePoint.x + 9;
        },
        y: function (edge) {
          if (edge._snappedToMiddle) {
            edge.middlePoint = getEdgeMiddlePoint(edge)
          }

          return edge.middlePoint.y + 10;
        }
      });
    }

    function updateSvgNodes() {
      var svgNodes = getGlobalSvgGroup().selectAll("g.node");

      svgNodes.select('circle')
        .attr({
          'stroke-opacity': function (node) {
            if (getSelectedNode()) {

              if (isRelatedNodSelected(node)) {
                return 1;
              }

              return (node.isSelected || node.isSelected) ? 1 : opacityForNotSelectedEdgesAndNodes;
            }

            return '1';
          },
          stroke: function (node) {
            return node._color || defaultColor;
          },
          fill: function (node) {
            return node.isSelected ? node._color : backgroundColor;
          },
          cx: function (node) {
            return node._location.x
          },
          cy: function (node) {
            return node._location.y
          }
        });

      svgNodes.select('text')
        .text(function (node) {
          return node.label
        })
        .attr({
          'fill-opacity': function (node) {
            if (getSelectedNode()) {

              if (isRelatedNodSelected(node)) {
                return 1;
              }

              return (node.isSelected || node.isSelected) ? 1 : opacityForNotSelectedEdgesAndNodes;
            }

            return '1';
          },
          fill: function (node) {
            return node._color || defaultColor;
          },
          x: function (node) {
            return node._location.x + 20
          },
          y: function (node) {
            return node._location.y + 5
          }
        });
    }

    // return edge's arrow by it's uid, used for setting color, opacity,
    // preventing creating multiple arrows for one edge
    function getArrowById(uid) {
      var edgeArrow = svg.select('#end-arrow-' + uid);
      return edgeArrow;
    }

    // returns the global 'g' for the node
    function getGlobalSvgGroup() {
      return svg.select('g.' + globalGroupClass);
    }

    $scope.init();
  });

});