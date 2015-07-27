var optionsHeight = $('#accordion').height();

$('.panel-group').css('top', document.topBarHeight);
$('.panel-group').css('width', document.deviceWidth);
$('.panel-group').css('max-height', document.deviceHeight - document.topBarHeight);

$(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.btn-group').find('.dropdown-toggle').html( selText +'  <span class="caret"></span>');
  $(".selectedDefaultView").dropdown('toggle');
});

$("[name='filteringOptions']").bootstrapSwitch({
	onText: 'Global',
	offText: 'Local'
});

$('input[name="filteringOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
	angular.element('#settingsCtrl').scope().filteringOptions(state);
});

$("[name='hiddenAPOptions']").bootstrapSwitch({
	onText: 'Shown',
	offText: 'Hidden'
});

$('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
	angular.element('#settingsCtrl').scope().hiddenAPSettings(state);
});