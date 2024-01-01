let lastTime = null;
let totalTime = 0;

setInterval(function gameLoop() {
    const currentTime = Date.now();
    if (lastTime === null) {
        lastTime = currentTime;
    }
    const deltaTime = currentTime - lastTime;
    totalTime += deltaTime;
    lastTime = currentTime;
    updateMyGame(deltaTime, totalTime);
} , 1000 / 60);           

function handleMenuButtonClick(index) {
    //var index = $('#menubuttons .btn-main').index(this);
    
    $('#menubuttons .btn-main').removeClass('selected');                
    $('#menubuttons .btn-main').eq(index).addClass('selected');
    $('.menu-content').hide(); 
    $('#m' + (index)).show(); 
}

function handleMultiButtonClick(index){ 
    $('#multiselect .btn-main').removeClass('selected');
    $('#multiselect .btn-main').eq(index).addClass('selected');
    let multi = parseFloat($('#multiselect .btn-main').eq(index).val());
    return multi;                
}

/**
 * 
 * @param {index, multiplier, number} values 
 * @returns 
 */
function handleGenBtnClick(values) {            
    let i = values[0]; 
    let m = values[1];
    let n = values[2];    
    let baseCost = parseFloat($('#gencontainer .btn-main').eq(i).find('.btn-cost').attr('basecost'));
    let qty = m === -1 ? parseFloat($('#gencontainer .btn-main').eq(i).find('.btn-qty').attr('qty')) : m;
    let cost = baseCost * qty;
    if (n >= cost) {
        n -= cost;
        i++;
        return [i, qty , n];
    } else {
        return -1;
    }                
}

function updateTheNumber(n) {
    let num = parseFloat(n);    
    let formattedNumber = num >= 1e12 ? num.toExponential(2) : Math.floor(num).toLocaleString();
    $('#thenumber').text(formattedNumber);    
}

function updateNgen(nrows) {
    for (let i = 1; i <= nrows; i++) {        
        $('#ngen' + i).text(
            ngen[i] >= 1e7
                ? ngen[i].toExponential(2)
                : Math.floor(ngen[i]).toLocaleString()
        );
        $('#ngeneff' + i).text(
            ngeneff[i] * 100 >= 1e7
                ? (ngeneff[i] * 100).toExponential(2)
                : Math.floor(ngeneff[i] * 100).toLocaleString()
        );
    }
}

function updateTickCost(n, t){    
    let cost = 100*Math.pow(10,Math.log2(t));
    $('#tickcost').text(cost > 1e6 ? cost.toExponential(2) : cost.toLocaleString());
    if (n < cost) {
        $('#tick').addClass('grayed');
    } else {
        $('#tick').removeClass('grayed');
    }
}

function handleTickBuy(x) {
    let n = x[0];
    let t = x[1];
    let cost = 100*Math.pow(10,Math.log2(t));
    if (n >= cost){        
        n -= cost;
        t *= 2;
    }    
    return [n,t];
}

function updateGenBtnCost(mult) {
    $('.btn-gen').each(function() {
        let button = $(this);
        let buttonqty = button.find('.btn-qty');
        let buttoncost = button.find('.btn-cost');        
        if (mult == -1) {
            let qty = parseFloat(buttonqty.attr('qty'));
            buttonqty.text('+' + (
                qty >=1e7
                    ? qty.toExponential(2)
                    : Math.floor(qty).toLocaleString()
            ));
            let currentcost = parseFloat(buttoncost.attr('basecost')) * qty;
            if (currentcost >= 1) {
                buttoncost.text('Cost: ' + (
                    currentcost >=1e7
                        ? currentcost.toExponential(2)
                        : Math.floor(currentcost).toLocaleString()
                ));
            } else {
                buttoncost.text('Cost ' + parseFloat(buttoncost.attr('basecost')).toLocaleString());
            }
        } else {
            buttonqty.text('+' + mult);
            buttoncost.text('Cost: ' + parseFloat(buttoncost.attr('basecost') * mult).toLocaleString());
        }
    });
}

function updateGenBtnAvaiable(mult, n) {
    $('.btn-gen').addClass('grayed');
    $('.btn-gen').each(function() {
        let baseCost = parseFloat($(this).find('.btn-cost').attr('basecost'));
        let qtyElement = $(this).find('.btn-qty');
        let qty = Math.floor(n / baseCost);
        qtyElement.attr('qty', qty);
        if (mult == -1) {
            if (qty > 0) {               
                $(this).removeClass('grayed');
            }
        } else if (baseCost * mult <= n) {
            $(this).removeClass('grayed');
        }
    });
}

function makeGeneratorRow(nrows, id) {
    let container = $('#' + id);
    for (let i = 0; i < nrows; i++) {
        let newrow = $('<div class="row m-4 border border-3 border-danger" id="ngenrow' + (i + 1) + '"></div>');   
        container.append(newrow);
        makeGeneratorCol('ngenrow' + (i + 1));
    }
}

function makeGeneratorCol(id) {
    let container = $('#' + id);
    let nid = id.match(/\d+/)[0];

    let gencolname = $('<div class="col-xl-2 my-4 h3 text-danger text-weight-bold"></div>');
    let gencolqty = $('<div class="col-xl-2 my-3"></div>');
    let genqty = $('<div class="text-danger text-weight-bold h4" id="ngen' + nid + '">0</div>');
    let geneff = $('<div class="h6 text-light">(Eff:<span id="ngeneff' + nid + '">0</span>%)</div>');
    let gencolprogbar = $('<div class="col-xl-6" id="ngenprogbar' + nid + '"></div>');
    let gencolbutton = $('<div class="col-xl-2 my-2"></div>');
    let genbuttonpos = $('<div class="d-flex justify-content-end"></div>');
    let genbutton = $('<button class="btn btn-main btn-gen border border-3 border-danger" style="font-size:20px; width:200px"></button>');
    let genbuttonqty = $('<span class="btn-qty" id="ngenqtybuy' + nid + '">+1</span><br>');
    let genbuttoncost = $('<span class="btn-cost" id="ngencost' + nid + '" basecost="' + Math.pow(10,nid)  + '">Cost: ' + Math.pow(10,nid) + '</span>');
    
    container.append(gencolname);
    container.append(gencolqty);
    container.append(gencolprogbar);
    container.append(gencolbutton);
    
    gencolname.append('Generator ' + nid + ':');
    gencolqty.append(genqty);
    gencolqty.append(geneff);
    genbutton.append(genbuttonqty);
    genbutton.append(genbuttoncost);
    genbuttonpos.append(genbutton);
    gencolbutton.append(genbuttonpos);
}
            

