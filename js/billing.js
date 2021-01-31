(function ($) {
  $(function () {
    sessionStorage.setItem('productRowCount', 1);
    initProductAutoComplete(1);

    $('#productTable').on('click', '#addProductBtn', function (e) {
      appendNewProductRow(e);
    });

    $('#productTable').on('click', '#removeProductBtn', function (e) {
      $(e.currentTarget).parent().parent().remove();
      redrawSerialNumber();
    });

  }); // end of document ready

  function appendNewProductRow(e) {
    let count = parseInt(sessionStorage.getItem('productRowCount'));
    sessionStorage.setItem('productRowCount', count + 1);
    let productRowCount = parseInt(sessionStorage.getItem('productRowCount'));
    let productRow = `
    <tr class="row" id="productline_` + productRowCount + `">
      <td class="col m1" style="padding: 30px;" id="product_sno_` + productRowCount + `">` + productRowCount + `</td>
      <td class="col m7">
      <div class="input-field">
        <input type="text" id="product_` + productRowCount + `" class="autocomplete">
        <label for="product_` + productRowCount + `">Product</label>
      </div>
      </td>
      <td class="col m2">
      <div class="input-field col">
        <input id="price_` + productRowCount + `" type="text">
        <label for="price_` + productRowCount + `">Price </label>
      </div>
      </td>
      <td class="col m2" style="padding-top: 30px;">
      <a id="addProductBtn" class="btn-floating btn-small waves-effect waves-light blue small"><i
        class="material-icons">add</i></a>
      <a id="removeProductBtn" class="btn-floating btn-small waves-effect waves-light red small"><i
        class="material-icons">remove</i></a>
      </td>
    </tr>`;


    $(e.currentTarget).parent().parent().parent().append(productRow);
    initProductAutoComplete(productRowCount);
    calculateTotal();
  }

  function calculateTotal() {
    $('#totalRow').remove();
    let totalRow = `
    <tr class="row" id="totalRow">
      <td class="col m1"></td>
      <td class="col m7" style="text-align: right;"><b>TOTAL :</b></td>
      <td class="col m2" style="margin-left: 11.25px;"><b id="total_amount">0.0</b></td>
      <td class="col m2"></td>
    </tr>`;

    $('#productTable').append(totalRow);
  }

  function initProductAutoComplete(productRowCount) {
    $('#product_' + productRowCount).last().autocomplete({
      data: {
        "Headlight replacement": null,
        "Self Start motor repair": null,
        "Oil Service": null,
        "General Service": null,
        "Water Wash": null
      },
      minLength: 0,
      sortFunction: function (a, b, inputString) {
        return a.indexOf(inputString) - b.indexOf(inputString);
      }
    });
  }

  function redrawSerialNumber() {
    let productRowCount = parseInt(sessionStorage.getItem('productRowCount'));
    let count = 0;
    for (var i = 1; i <= productRowCount; i++) {
      let snoElement = $('#product_sno_' + i);
      if (snoElement.length > 0) {
        count++;
        $('#product_sno_' + i).html(count);
        $('#product_sno_' + i).attr('id', 'product_sno_' + count);
      }
    }
    sessionStorage.setItem('productRowCount', count)
  }




})(jQuery); // end of jQuery name space
