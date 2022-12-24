const tempData = '<!--DATA-->';

function convertTkCrudTableToJSON(tblElm, cmd) {
  var tHeadString = '{"head": [' + tempData + '], ';
  var tHeadStringTemp = '';
  var tBodyString = '"body": [' + tempData + ']}';
  var tBodyStringTemp = '';
  var returnString = '';
  $(tblElm).find('thead > tr > th').each(function() {
    tHeadStringTemp += '"' + $(this).text() + '", ';
  });
  tHeadStringTemp = tHeadStringTemp.substring(0, tHeadStringTemp.length - 2);
  tHeadString = tHeadString.replace(tempData, tHeadStringTemp);
  $(tblElm).find('tbody > tr').each(function(index, value) {
    if (!$(this).hasClass('is-delete')) {
      tBodyStringTemp += '{';
      $(this).find('td > input').each(function() {
        tBodyStringTemp += '"' + $(this).attr('tbl-data') + '": "' + $(this).val() + '", ';
      });
      tBodyStringTemp = tBodyStringTemp.substring(0, tBodyStringTemp.length - 2);
      if ((cmd === 'C' && cmd !== 'D') && index === $(this).parent().find('tr').length - 1) {
        tBodyStringTemp += '}, {';
        $(this).find('td > input').each(function() {
          tBodyStringTemp += '"' + $(this).attr('tbl-data') + '": "' + $(this).val() + '", ';
        });
        tBodyStringTemp = tBodyStringTemp.substring(0, tBodyStringTemp.length - 2);
      }
      tBodyStringTemp += '}, ';
    }
  });
  tBodyStringTemp = tBodyStringTemp.substring(0, tBodyStringTemp.length - 2);
  tBodyString = tBodyString.replace(tempData, tBodyStringTemp);
  returnString = tHeadString + tBodyString;
  return returnString;
}

function setTkCrudTable(tblElm, data, cmd, callback) {
  var dataJSON = $.parseJSON(data);
  var tHeadString = '<thead><tr>' + tempData + '</tr></thead>';
  var tHeadStringTemp = '';
  var tBodyString = '<tbody>' + tempData + '</tbody>';
  var tBodyStringTemp = '';
  $(tblElm).html('');
  $.each(dataJSON.head, function(index, value) {
    tHeadStringTemp += '<th>' + value + '</th>';
  });
  tHeadString = tHeadString.replace(tempData, tHeadStringTemp);
  $(tblElm).append(tHeadString);
  $.each(dataJSON.body, function(index, value) {
    var tBodyStringRow = '<tr>' + tempData + '</tr>';
    var tBodyStringRowTemp = '';
    $.each(value, function(index2, value2) {
      tBodyStringRowTemp += '<td class="tk-crud-data"><input type="text" class="tk-crud-text" value="' + value2 + '" tbl-data="' + index2 + '" /></td>';
    });
    tBodyStringRow = tBodyStringRow.replace(tempData, tBodyStringRowTemp);
    tBodyStringTemp += tBodyStringRow;
    if (cmd === 'R' && dataJSON.body.length === index + 1) {
      var tBodyStringRowEmpty = '<tr>' + tempData + '</tr>';
      var tBodyStringRowEmptyTemp = '';
      $.each(value, function(index2, value2) {
        tBodyStringRowEmptyTemp += '<td><input type="text" class="tk-crud-text" tbl-data="' + index2 + '" /></td>';
      });
      tBodyStringRowEmpty = tBodyStringRowEmpty.replace(tempData, tBodyStringRowEmptyTemp);
      tBodyStringTemp += tBodyStringRowEmpty;
    }
  });
  tBodyString = tBodyString.replace(tempData, tBodyStringTemp);
  $(tblElm).append(tBodyString);
  if (!!callback) {
    callback(tblElm);
  }
}

$(document).ready(function() {
  $.fn.tkCrudTable = function(option) {
    var tblElm = this;
    var tblData = option.data;
    setTkCrudTable(tblElm, tblData, 'R');
    $(this).on('focus', 'input.tk-crud-text', function() {
      $(this).parent().addClass('active');
    });
    $(this).on('blur', 'input.tk-crud-text', function() {
      $(this).parent().removeClass('active');
      tblData = convertTkCrudTableToJSON(tblElm, 'U');
    });
    $(this).on('keydown', 'tr:last-child > td:last-child > input.tk-crud-text', function(evt) {
      if (evt.keyCode === 9 && !evt.shiftKey) {
        evt.preventDefault();
        tblData = convertTkCrudTableToJSON(tblElm, 'C');
        setTkCrudTable(tblElm, tblData, 'C', function() {
          $(tblElm).find('tbody > tr:last-child > td:first-child > input.tk-crud-text').focus();
        });
      }
    });
    $(this).on('keydown', 'tr:last-child > td > input.tk-crud-text', function(evt) {
      if (evt.keyCode === 13) {
        tblData = convertTkCrudTableToJSON(tblElm, 'C');setTkCrudTable(tblElm, tblData, 'C', function() {
          $(tblElm).find('tbody > tr:last-child > td:first-child > input.tk-crud-text').focus();
        });
      }
    });
    $(this).on('keydown', 'tr > td.tk-crud-data > input.tk-crud-text', function(evt) {
      if (evt.keyCode === 46) {
        var msg = (typeof option.deleteMessage === 'undefined') ? 'Do you really want to delete this row?' : option.deleteMessage;
        if (confirm(msg)) {
          evt.preventDefault();
          $(this).parent().parent().addClass('is-delete');
          tblData = convertTkCrudTableToJSON(tblElm, 'D');
          setTkCrudTable(tblElm, tblData, 'D');
        }
      }
    });
    return this;
  };
});

// From here below is how to use.
// Assuming that I got this JSON from the database
var result = '{"head": ["Data 1", "Data 2", "Data 3"], "body": [{"data1": "Value 1_1", "data2": "Value 2_1", "data3": "Value 3_1"}, {"data1": "Value 1_2", "data2": "Value 2_2", "data3": "Value 3_2"}, {"data1": "Value 1_3", "data2": "Value 2_3", "data3": "Value 3_3"}, {"data1": "Value 1_4", "data2": "Value 2_4", "data3": "Value 3_4"}, {"data1": "Value 1_5", "data2": "Value 2_5", "data3": "Value 3_5"}]}';

$(document).ready(function() {
  $('.tk-crud-table').tkCrudTable({
    data: result,
    deleteMessage: 'Do you really want to delete this row?'
    // TODO: validator
  });
});