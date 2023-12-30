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

function updateTheNumber() {
    $('#thenumber').text(theNumber >  1e12 ? theNumber.toExponential(2) : theNumber.toLocaleString());
}

function updateTickCost(){    
    let tickCurrentCost = 100*Math.pow(10,Math.log2(tick));
    $('#tickcost').text(tickCurrentCost > 1e6 ? tickCurrentCost.toExponential() : tickCurrentCost.toLocaleString());
    if (theNumber < tickCurrentCost) {
        $('#tick').addClass('grayed');
    } else {
        $('#tick').removeClass('grayed');
    }
}

function updateGenBtnCost(mult) {
    if (mult == -1) {
        $('.btn-gen').addClass('grayed');
    }

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
    let genbutton = $('<button class="btn btn-main btn-gen border border-3 border-danger" style="font-size:20px; width:170px" basecost="' + Math.pow(10,nid)  + '"></button>');
    let genbuttonqty = $('<span id="ngenqtybuy' + nid + '">+1</span><br>');
    let genbuttoncost = $('<span id="ngencost' + nid + '">Cost: ' + Math.pow(10,nid) + '</span>');
    
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
            

