var hoveredOnReport = false;

$(window).load(function() {
  $(document).mouseup(function(e) {
    $('.retractOnUnfocus').each(function(index, object) {
      var container = $(this);
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(container).collapse('hide');
      }
    });
  });

  $('#weeklyReportTable').hover(function() { //report to flag it hovered on report table
    hoveredOnReport = true;
  }, function() {
    hoveredOnReport = false;
  });

  $(function() {//scroll horz when scrolling vert on report section
    $(window).on('wheel', function(e) {
      if (hoveredOnReport) {
        var delta = e.originalEvent.deltaY;
        if (delta > 0 && $('#weeklyReportTableContainer').scrollLeft() != ($('#weeklyReportTable').width() - 700)) {
          $('#weeklyReportTableContainer').scrollLeft($('#weeklyReportTableContainer').scrollLeft() + 30);

          //console.log('down');
        } else if (delta < 0 && $('#weeklyReportTableContainer').scrollLeft() != 0) {
          $('#weeklyReportTableContainer').scrollLeft($('#weeklyReportTableContainer').scrollLeft() - 30);

          //console.log('up');
        }

        if(delta!=0)return false; // this line is only added so the whole page won't scroll in the demo
        //console.log('farts');
      }
    });
  });

  $(document).ready(function() {

    $(window).resize(function() {
      $(".collapse").collapse('hide');
    });

    $(".collapse").on('show.bs.collapse', function() { //calc horz pos of advanced pullout tabs
      if ($(window).width() <= 800) { //incase of min width 800
        $("#incomeAdvancedTab").css({
          'right': $(window).width() - 390 + 'px'
        });
        $("#costAdvancedTab").css({
          'right': $(window).width() - 790 + 'px'
        });
      } else {
        $("#incomeAdvancedTab").css({ //when width is 60%
          'right': (($(window).width() - 800) / 2) + 411 + 'px'
        });
        $("#costAdvancedTab").css({
          'right': (($(window).width() - 800) / 2) + 10 + 'px'
        });
      }
    });

    $('#incomeInfiniteTerm').click(function() { //infinity button disable end date - income
      if ($('#incomeInfiniteTerm').is(':checked')) {
        $('#incomeEndTerm').prop("disabled", true);
      } else {
        $('#incomeEndTerm').prop("disabled", false);
      }
    });

    $('#costInfiniteTerm').click(function() { //infinity button disable end date - cost
      if ($('#costInfiniteTerm').is(':checked')) {
        $('#costEndTerm').prop("disabled", true);
      } else {
        $('#costEndTerm').prop("disabled", false);
      }
    });

    $('#incomeModalInfiniteTerm').click(function() { //infinity button disable end date - cost
      if ($('#incomeModalInfiniteTerm').is(':checked')) {
        $('#incomeModalEndTerm').prop("disabled", true);
      } else {
        $('#incomeModalEndTerm').prop("disabled", false);
      }
    });
  });
  
  $('#incomeRepeatCheck').click(function() { //repeat check to expand advanced repeat - income
      if ($('#incomeRepeatCheck').is(':checked')) {
        $("#incomeAdvancedTab").collapse('show');
      }
    });
  
  $('#costRepeatCheck').click(function() { //repeat check to expand advanced repeat - cost
      if ($('#costRepeatCheck').is(':checked')) {
        $("#costAdvancedTab").collapse('show');
      }
    });

  function checkHidden(x) { //check whatever id or class is fed
    $(x).prop("checked", true);
  }
});