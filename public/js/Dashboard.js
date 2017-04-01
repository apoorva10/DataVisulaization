var type = 1;

document.getElementById('checkButton').onclick = function() {
   alert("button was clicked");
   queue()
    .defer(d3.json, "/api/data")
	.defer(d3.json,"/api/data1")
	.await(makeGraphs);
	 type = 2;
}



//alert("button was not clicked");
queue().defer(d3.json,"/api/data").await(makeGraphs1);
// queue()
//     .defer(d3.json, "/api/data")
//     .defer(d3.json, "/api/data1")
//     .await(makeGraphs);
    
 $( function() {
    var availableTags = [
      "Tom Colicchio's Craftsteak",
      "",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  } );

function makeGraphs(error, apiData1, apiData2) {
	
//Start Transformations
	var dataSet = apiData1;
	var dataset1=apiData2;
	// var dateFormat = d3.time.format("%Y-%m-%d");
	// dataSet.forEach(function(d) {
	// 	d.date = dateFormat.parse(d.date);
	// 	if(d.date){
	// 		d.date.setDate(1);
	// 		//d.stars =+d.stars;
	// 	}
	// 			//d.date.setDate();
	// 	// d.total_donations = +d.total_donations;
	// });
var dateFormat = d3.time.format("%Y-%m-%d");
	dataSet.forEach(function(d) {
		if(d.date){

			//alert(d.date_posted);
		}
		d.date = dateFormat.parse(d.date);

		//alert(d.date_posted);
		if(d.date){
			d.date.setDate(1);
			//d.stars =+d.stars;
		}
		//d.business_reviews.funny = +d.business_reviews.useful;	
		//d.business_reviews.funny = +d.business_reviews.funny;
		//d.business_reviews.funny = +d.business_reviews.cool;
	});
	dataset1.forEach(function(d) {
		if(d.date){

			//alert(d.date_posted);
		}
		d.date = dateFormat.parse(d.date);

		//alert(d.date_posted);
		if(d.date){
			d.date.setDate(1);
			//d.stars =+d.stars;
		}
		//d.business_reviews.funny = +d.business_reviews.useful;	
		//d.business_reviews.funny = +d.business_reviews.funny;
		//d.business_reviews.funny = +d.business_reviews.cool;
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);
	//ndx.add(dataset1);
	//var ndx1=crossfilter(dataset1);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.date; });
	 var monthReview1 = ndx.dimension(function(d) { return d.date.getMonth(); });
	// var resourceType = ndx.dimension(function(d) { return d.resource_type; });
	//var donutStatus = ndx.dimension(function(d) { return d.useful; });
	// var funny=ndx.dimension(function(d){return d.funny;});
	// var cool=ndx.dimension(function(d){return d.cool;})
	// var povertyLevel = ndx.dimension(function(d) { return d.date.getMonth(); });
	var review1 = ndx.dimension(function(d) { return d.stars; });
	// var totalDonations  = ndx.dimension(function(d) { return d.total_donations; });

	//var date=ndx1.dimension(function(d){ return d.date;});



	//Calculate metrics
	var projectsByDate = datePosted.group(); 
	//var projectsdate= date.group();
	var projectsByMonth1 = monthReview1.group(); 
	//var projectsByResourceType = resourceType.group();
	//var projectsByDonutStatus = donutStatus.group();
	//var projectsByPovertyLevel = povertyLevel.group();
	var reviewGroup = review1.group();

	var all = ndx.groupAll();
	//var all1 = ndx1.groupAll();

	//Calculate Groups
	var totalDonationsState = review1.group().reduceSum(function(d) {
		return d.stars;
	});

	var totalMonthReviews = monthReview1.group().reduceSum(function(d) {
		return d.date.getMonth();
	});

	// var totalDonationsDonutStatus = donutStatus.group().reduceSum(function(d) {
	// 	return d.useful;
	// });
	// var totalfunny=funny.group().reduceSum(function(d){
	// 	return d.funny;
	// });
	// var totalcool=funny.group().reduceSum(function(d){
	// 	return d.cool;
	// });



	var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.total_donations;});

	//Define threshold values for data
	// var minDate = datePosted.bottom(1).date;
	// var maxDate = datePosted.top(1).date;
	var minDate = datePosted.bottom(1)[0].date;
	var maxDate = datePosted.top(1)[0].date;

console.log(minDate);
console.log(maxDate);

	var compositeDateChart = dc.compositeChart("#date-chart");
	//var mytrail=dc.multiBarChart("#state-donations");
	var compositeReviewChart = dc.compositeChart("#poverty-chart");
	var compositeMonthChart = dc.compositeChart("#grade-chart");
	//var compositeDonutChart = dc.compositeChart("#funding-chart");
    //Charts
    //Charts
	var dateChart1 = dc.lineChart(compositeDateChart);
	// var dateChart1 = dc.lineChart("#date-chart1");
	 var monthLevelChart1 = dc.rowChart(compositeMonthChart);
	// var resourceTypeChart = dc.rowChart("#resource-chart");
	// //var donutStatusChart1 = dc.pieChart(compositeDonutChart);
	// var povertyLevelChart = dc.rowChart("#poverty-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	 var netDonations = dc.numberDisplay("#net-donations");
	var reviewDistribution1 = dc.barChart(compositeReviewChart);


  selectField = dc.selectMenu('#menuselect')
        .dimension(review)
        .group(reviewGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	netDonations
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(netTotalDonations)
		.formatNumber(d3.format(".3s"));

	dateChart1
		//.width(600)
		.height(220)
		.colors('red')
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		//
		//.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);
		// dateChart1
		// //.width(600)
		// .height(220)
		// .margins({top: 10, right: 50, bottom: 30, left: 50})
		// .dimension(date)
		// .group(projectsdate)
		// .renderArea(true)
		// .transitionDuration(500)
		// .x(d3.time.scale().domain([minDate, maxDate]))
		// .elasticY(true)
		// .renderHorizontalGridLines(true)
  //   	.renderVerticalGridLines(true)
		// .xAxisLabel("Year")
		// .yAxis().ticks(6);

	// resourceTypeChart
 //        //.width(300)
 //        .height(220)
 //        .dimension(resourceType)
 //        .group(projectsByResourceType)
 //        .elasticX(true)
 //        .xAxis().ticks(5);

	// povertyLevelChart
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(povertyLevel)
 //        .group(projectsByPovertyLevel)
 //        .xAxis().ticks(4);

	// monthLevelChart1
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(monthReview1)
 //        .group(projectsByMonth1)
 //        .xAxis().ticks(4);

  
    // donutStatusChart1
    //         .height(220)
    //         //.width(350)
    //         .radius(90)

    //         .innerRadius(70)
    //         .transitionDuration(1000)
    //       .dimension(donutStatus)
    //         .group(projectsByDonutStatus)
            
 

    reviewDistribution1
    	 //.width(500)
        .height(220)
         .transitionDuration(1000)
        .dimension(review1)
        .group(totalDonationsState)
         .margins({top: 10, right: 50, bottom: 30, left: 50})
        //.centerBar(true)
         .colors('red')
        .gap(50)
        //.elasticY(true)
       .x(d3.scale.ordinal().domain(review1))
       .xUnits(dc.units.ordinal)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .ordering(function(d){return d.stars;})
      .yAxis().ticks(6);


 ///copy 22222222222
 	//ndx.remove()
 	//ndx.add(dataset1);
    var ndx1 = crossfilter(dataset1);
 //Define Dimensions
	var datePosted = ndx1.dimension(function(d) { return d.date; });
	var monthReview = ndx1.dimension(function(d) { return d.date.getMonth(); });
	
	// var resourceType = ndx1.dimension(function(d) { return d.resource_type; });
	//var donutStatus = ndx.dimension(function(d) { return d.useful; });
	// var funny=ndx1.dimension(function(d){return d.funny;});
	// var cool=ndx1.dimension(function(d){return d.cool;})
	// var povertyLevel = ndx1.dimension(function(d) { return d.date.getMonth(); });
	var review= ndx1.dimension(function(d) { return d.stars; });
	// var totalDonations  = ndx1.dimension(function(d) { return d.total_donations; });

	//var date=ndx1.dimension(function(d){ return d.date;});



	//Calculate metrics
	projectsByDate = datePosted.group(); 
	//var projectsdate= date.group();
	var projectsByMonth = monthReview.group(); 
	// var projectsByResourceType = resourceType.group();
	// //var projectsByDonutStatus = donutStatus.group();
	// var projectsByPovertyLevel = povertyLevel.group();
	var reviewGroup = review.group();

	var all = ndx1.groupAll();
	//var all1 = ndx1.groupAll();

	//Calculate Groups
	var totalDonationsState1 = review.group().reduceSum(function(d) {
		return d.stars;
	});

	var totalMonthReviews = monthReview.group().reduceSum(function(d) {
		return d.date.getMonth();
	});

	// var totalDonationsFundingStatus = donutStatus.group().reduceSum(function(d) {
	// 	return d.useful;
	// // });
	// var totalfunny=funny.group().reduceSum(function(d){
	// 	return d.funny;
	// });
	// var totalcool=funny.group().reduceSum(function(d){
	// 	return d.cool;
	// });



	//var netTotalDonations = ndx1.groupAll().reduceSum(function(d) {return d.total_donations;});

	//Define threshold values for data
	// var minDate = datePosted.bottom(1).date;
	// var maxDate = datePosted.top(1).date;
	//var minDate = datePosted.bottom(1)[0].date;
	//var maxDate = datePosted.top(1)[0].date;

//console.log(minDate);
//console.log(maxDate);

    //Charts
	
	

	var dateChart2 = dc.lineChart(compositeDateChart);
	// var dateChart1 = dc.lineChart("#date-chart1");
	var monthLevelChart = dc.rowChart(compositeMonthChart);
	// var resourceTypeChart = dc.rowChart("#resource-chart");
	//var donutStatusChart2 = dc.pieChart(compositeDonutChart);
	// var povertyLevelChart = dc.rowChart("#poverty-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var netDonations = dc.numberDisplay("#net-donations");
	var reviewDistribution2 = dc.barChart(compositeReviewChart);


 //  selectField = dc.selectMenu('#menuselect')
 //        .dimension(review)
 //        .group(reviewGroup); 

 //       dc.dataCount("#row-selection")
 //        .dimension(ndx)
 //        .group(all);


	// totalProjects
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(all);

	// netDonations
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(netTotalDonations)
	// 	.formatNumber(d3.format(".3s"));

	dateChart2
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		//.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);
		
compositeDateChart
    //.width(400)
    .height(220)
    .x(d3.time.scale().domain([minDate, maxDate]))
    
    .compose([dateChart1,
      dateChart2
    ]);
    


	// resourceTypeChart
 //        //.width(300)
 //        .height(220)
 //        .dimension(resourceType)
 //        .group(projectsByResourceType)
 //        .elasticX(true)
 //        .xAxis().ticks(5);

	// povertyLevelChart
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(povertyLevel)
 //        .group(projectsByPovertyLevel)
 //        .xAxis().ticks(4);

	monthLevelChart
		//.width(300)
		.height(220)
        .dimension(monthReview)
        .group(projectsByMonth)
        .xAxis().ticks(4);

   //  compositeMonthChart
   //  //.width(500)
   //  .height(220)
   // // .margins({top: 10, right: 50, bottom: 30, left: 50})
   //  .dimension(monthReview1)
   //  .group(projectsByMonth1)
   //  .compose([monthLevelChart1,
   //    monthLevelChart
   //  ]).render();

  
          // donutStatusChart2
          //   .height(220)
          //   //.width(350)
          //   //.margins({top: 10, right: 50, bottom: 30, left: 50})
          //   .radius(60)
          //   .innerRadius(40)
          //   .transitionDuration(1000)
          // .dimension(donutStatus)
          //   .group(projectsByDonutStatus)
            
// compositeDonutChart
//     //.width(400)
//     .height(220)
//     .compose([donutStatusChart1,
//       donutStatusChart2
//     ]);

    reviewDistribution2
    	 //.width(500)
         .height(220)
         .transitionDuration(1000)
        .dimension(review)
        .group(totalDonationsState1)
        .margins({top: 10, right: 50, bottom: 30, left: 0})
       //.centerBar(true)
        .colors('steelblue')
       .gap(30)
       //.elasticY(true)
      .x(d3.scale.ordinal().domain(review))
        .xUnits(dc.units.ordinal)
       .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
      .ordering(function(d){return d.stars;})
      .yAxis().ticks(6);

    compositeReviewChart
    //.width(500)
    .height(220)
   // .margins({top: 10, right: 50, bottom: 30, left: 50})
    .x(d3.scale.ordinal().domain(review1))
    .xUnits(dc.units.ordinal)
    .group(totalDonationsState1)
    .compose([reviewDistribution1,
      reviewDistribution2
    ]);
 
    

    dc.renderAll();

};

function makeGraphs1(error, apiData1) {
	
//Start Transformations
	var dataSet = apiData1;
	// var dateFormat = d3.time.format("%Y-%m-%d");
	// dataSet.forEach(function(d) {
	// 	d.date = dateFormat.parse(d.date);
	// 	if(d.date){
	// 		d.date.setDate(1);
	// 		//d.stars =+d.stars;
	// 	}
	// 			//d.date.setDate();
	// 	// d.total_donations = +d.total_donations;
	// });
var dateFormat = d3.time.format("%Y-%m-%d");
	dataSet.forEach(function(d) {
		if(d.date){

			//alert(d.date_posted);
		}
		d.date = dateFormat.parse(d.date);

		//alert(d.date_posted);
		if(d.date){
			d.date.setDate(1);
			//d.stars =+d.stars;
		}
		//d.business_reviews.funny = +d.business_reviews.useful;	
		//d.business_reviews.funny = +d.business_reviews.funny;
		//d.business_reviews.funny = +d.business_reviews.cool;
	});
	// dataset1.forEach(function(d) {
	// 	if(d.date){

	// 		//alert(d.date_posted);
	// 	}
	// 	d.date = dateFormat.parse(d.date);

	// 	//alert(d.date_posted);
	// 	if(d.date){
	// 		d.date.setDate(1);
	// 		//d.stars =+d.stars;
	// 	}
	// 	//d.business_reviews.funny = +d.business_reviews.useful;	
	// 	//d.business_reviews.funny = +d.business_reviews.funny;
	// 	//d.business_reviews.funny = +d.business_reviews.cool;
	// });

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);
	//ndx.add(dataset1);
	//var ndx1=crossfilter(dataset1);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.date; });
	 var monthReview1 = ndx.dimension(function(d) { return d.date.getMonth(); });
	// var resourceType = ndx.dimension(function(d) { return d.resource_type; });
	//var donutStatus = ndx.dimension(function(d) { return d.useful; });
	// var funny=ndx.dimension(function(d){return d.funny;});
	// var cool=ndx.dimension(function(d){return d.cool;})
	// var povertyLevel = ndx.dimension(function(d) { return d.date.getMonth(); });
	var review1 = ndx.dimension(function(d) { return d.stars; });
	// var totalDonations  = ndx.dimension(function(d) { return d.total_donations; });

	//var date=ndx1.dimension(function(d){ return d.date;});


var monthPosted = 	ndx.dimension(function(d) { return d3.time.format("%B %Y")(d.date); });
	//Calculate metrics
	var projectsByDate = datePosted.group(); 
	//var projectsdate= date.group();
	var projectsByMonth1 = monthReview1.group(); 
	//var projectsByResourceType = resourceType.group();
	//var projectsByDonutStatus = donutStatus.group();
	//var projectsByPovertyLevel = povertyLevel.group();
	var reviewGroup = review1.group();
	var reviewsByMon = monthPosted.group();

	var all = ndx.groupAll();
	//var all1 = ndx1.groupAll();

	//Calculate Groups
	var totalDonationsState = review1.group().reduceSum(function(d) {
		return d.stars;
	});

	var totalMonthReviews = monthReview1.group().reduceSum(function(d) {
		return d.date.getMonth();
	});

	// var totalDonationsDonutStatus = donutStatus.group().reduceSum(function(d) {
	// 	return d.useful;
	// });
	// var totalfunny=funny.group().reduceSum(function(d){
	// 	return d.funny;
	// });
	// var totalcool=funny.group().reduceSum(function(d){
	// 	return d.cool;
	// });



	var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.total_donations;});

	//Define threshold values for data
	// var minDate = datePosted.bottom(1).date;
	// var maxDate = datePosted.top(1).date;
	var minDate = datePosted.bottom(1)[0].date;
	var maxDate = datePosted.top(1)[0].date;

console.log(minDate);
console.log(maxDate);

	// var compositeDateChart = dc.compositeChart("#date-chart");
	// //var mytrail=dc.multiBarChart("#state-donations");
	// var compositeReviewChart = dc.compositeChart("#poverty-chart");
	// var compositeMonthChart = dc.compositeChart("#grade-chart");
	//var compositeDonutChart = dc.compositeChart("#funding-chart");
    //Charts
    //Charts
	var dateChart1 = dc.lineChart("#date-chart");
	// var dateChart1 = dc.lineChart("#date-chart1");
	 //var monthLevelChart1 = dc.rowChart(compositeMonthChart);
	// var resourceTypeChart = dc.rowChart("#resource-chart");
	// //var donutStatusChart1 = dc.pieChart(compositeDonutChart);
	// var povertyLevelChart = dc.rowChart("#poverty-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	 var netDonations = dc.numberDisplay("#net-donations");
	var reviewDistribution1 = dc.barChart("#poverty-chart");
var pieChart1 = dc.pieChart("#funding-chart");

  selectField = dc.selectMenu('#menuselect')
        .dimension(review1)
        .group(reviewGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	netDonations
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(netTotalDonations)
		.formatNumber(d3.format(".3s"));

	// dateChart1
	// 	.width(600)
	// 	.height(220)
	// 	.colors('red')
	// 	.margins({top: 10, right: 50, bottom: 30, left: 50})
	// 	.dimension(datePosted)
	// 	.group(projectsByDate)
	// 	.renderArea(true)
	// 	.transitionDuration(500)
	// 	.elasticY(true)
	// 	.renderHorizontalGridLines(true)
 //    	.renderVerticalGridLines(true)
	// 	.xAxisLabel("Year")
	// 	.yAxis().ticks(6);
		dateChart1
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);

	// resourceTypeChart
 //        //.width(300)
 //        .height(220)
 //        .dimension(resourceType)
 //        .group(projectsByResourceType)
 //        .elasticX(true)
 //        .xAxis().ticks(5);

	// povertyLevelChart
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(povertyLevel)
 //        .group(projectsByPovertyLevel)
 //        .xAxis().ticks(4);

	// monthLevelChart1
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(monthReview1)
 //        .group(projectsByMonth1)
 //        .xAxis().ticks(4);

  
    // donutStatusChart1
    //         .height(220)
    //         //.width(350)
    //         .radius(90)

    //         .innerRadius(70)
    //         .transitionDuration(1000)
    //       .dimension(donutStatus)
    //         .group(projectsByDonutStatus)
            


    reviewDistribution1
    	 .width(500)
        .height(220)
         .transitionDuration(1000)
        .dimension(review1)
        .group(totalDonationsState)
         .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(true)
         .colors('red')
        .gap(50)
        .elasticY(true)
       .x(d3.scale.ordinal().domain(review1))
       .xUnits(dc.units.ordinal)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .ordering(function(d){return d.stars;})
      .yAxis().ticks(6);

 pieChart1
        .dimension(monthPosted)
        .group(reviewsByMon)
          .width(200)
          .height(200)
          .innerRadius(50)
          
         ;
 ///copy 22222222222
 	//ndx.remove()
 	//ndx.add(dataset1);
    // var ndx1 = crossfilter(dataset1);
 //Define Dimensions
	// var datePosted = ndx1.dimension(function(d) { return d.date; });
	// var monthReview = ndx1.dimension(function(d) { return d.date.getMonth(); });
	
	// var resourceType = ndx1.dimension(function(d) { return d.resource_type; });
	//var donutStatus = ndx.dimension(function(d) { return d.useful; });
	// var funny=ndx1.dimension(function(d){return d.funny;});
	// var cool=ndx1.dimension(function(d){return d.cool;})
	// var povertyLevel = ndx1.dimension(function(d) { return d.date.getMonth(); });
	// var review= ndx1.dimension(function(d) { return d.stars; });
	// var totalDonations  = ndx1.dimension(function(d) { return d.total_donations; });

	//var date=ndx1.dimension(function(d){ return d.date;});



	//Calculate metrics
	// projectsByDate = datePosted.group(); 
	// //var projectsdate= date.group();
	// var projectsByMonth = monthReview.group(); 
	// // var projectsByResourceType = resourceType.group();
	// // //var projectsByDonutStatus = donutStatus.group();
	// // var projectsByPovertyLevel = povertyLevel.group();
	// var reviewGroup = review.group();

	// // var all = ndx1.groupAll();
	// //var all1 = ndx1.groupAll();

	// //Calculate Groups
	// var totalDonationsState1 = review.group().reduceSum(function(d) {
	// 	return d.stars;
	// });

	// var totalMonthReviews = monthReview.group().reduceSum(function(d) {
	// 	return d.date.getMonth();
	// });

	// var totalDonationsFundingStatus = donutStatus.group().reduceSum(function(d) {
	// 	return d.useful;
	// // });
	// var totalfunny=funny.group().reduceSum(function(d){
	// 	return d.funny;
	// });
	// var totalcool=funny.group().reduceSum(function(d){
	// 	return d.cool;
	// });



	//var netTotalDonations = ndx1.groupAll().reduceSum(function(d) {return d.total_donations;});

	//Define threshold values for data
	// var minDate = datePosted.bottom(1).date;
	// var maxDate = datePosted.top(1).date;
	//var minDate = datePosted.bottom(1)[0].date;
	//var maxDate = datePosted.top(1)[0].date;

//console.log(minDate);
//console.log(maxDate);

    //Charts
	
	

	// var dateChart2 = dc.lineChart(compositeDateChart);
	// // var dateChart1 = dc.lineChart("#date-chart1");
	// var monthLevelChart = dc.rowChart(compositeMonthChart);
	// // var resourceTypeChart = dc.rowChart("#resource-chart");
	// //var donutStatusChart2 = dc.pieChart(compositeDonutChart);
	// // var povertyLevelChart = dc.rowChart("#poverty-chart");
	// var totalProjects = dc.numberDisplay("#total-projects");
	// var netDonations = dc.numberDisplay("#net-donations");
	// var reviewDistribution2 = dc.barChart(compositeReviewChart);


 //  selectField = dc.selectMenu('#menuselect')
 //        .dimension(review)
 //        .group(reviewGroup); 

 //       dc.dataCount("#row-selection")
 //        .dimension(ndx)
 //        .group(all);


	// totalProjects
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(all);

	// netDonations
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(netTotalDonations)
	// 	.formatNumber(d3.format(".3s"));

// 	dateChart2
// 		//.width(600)
// 		.height(220)
// 		.margins({top: 10, right: 50, bottom: 30, left: 50})
// 		.dimension(datePosted)
		
// 		.group(projectsByDate)
// 		.renderArea(true)
// 		.transitionDuration(500)
// 		//.x(d3.time.scale().domain([minDate, maxDate]))
// 		.elasticY(true)
// 		.renderHorizontalGridLines(true)
//     	.renderVerticalGridLines(true)
// 		.xAxisLabel("Year")
// 		.yAxis().ticks(6);
		
// compositeDateChart
//     //.width(400)
//     .height(220)
//     .x(d3.time.scale().domain([minDate, maxDate]))
    
//     .compose([dateChart1,
//       dateChart2
//     ]);
    


// 	// resourceTypeChart
//  //        //.width(300)
//  //        .height(220)
//  //        .dimension(resourceType)
//  //        .group(projectsByResourceType)
//  //        .elasticX(true)
//  //        .xAxis().ticks(5);

// 	// povertyLevelChart
// 	// 	//.width(300)
// 	// 	.height(220)
//  //        .dimension(povertyLevel)
//  //        .group(projectsByPovertyLevel)
//  //        .xAxis().ticks(4);

// 	monthLevelChart
// 		//.width(300)
// 		.height(220)
//         .dimension(monthReview)
//         .group(projectsByMonth)
//         .xAxis().ticks(4);

//    //  compositeMonthChart
//    //  //.width(500)
//    //  .height(220)
//    // // .margins({top: 10, right: 50, bottom: 30, left: 50})
//    //  .dimension(monthReview1)
//    //  .group(projectsByMonth1)
//    //  .compose([monthLevelChart1,
//    //    monthLevelChart
//    //  ]).render();

  
//           // donutStatusChart2
//           //   .height(220)
//           //   //.width(350)
//           //   //.margins({top: 10, right: 50, bottom: 30, left: 50})
//           //   .radius(60)
//           //   .innerRadius(40)
//           //   .transitionDuration(1000)
//           // .dimension(donutStatus)
//           //   .group(projectsByDonutStatus)
            
// // compositeDonutChart
// //     //.width(400)
// //     .height(220)
// //     .compose([donutStatusChart1,
// //       donutStatusChart2
// //     ]);

//     reviewDistribution2
//     	 //.width(500)
//          .height(220)
//          .transitionDuration(1000)
//         .dimension(review)
//         .group(totalDonationsState1)
//         .margins({top: 10, right: 50, bottom: 30, left: 0})
//        //.centerBar(true)
//         .colors('steelblue')
//        .gap(30)
//        //.elasticY(true)
//       .x(d3.scale.ordinal().domain(review))
//         .xUnits(dc.units.ordinal)
//        .renderHorizontalGridLines(true)
//         .renderVerticalGridLines(true)
//       .ordering(function(d){return d.stars;})
//       .yAxis().ticks(6);

//     compositeReviewChart
//     //.width(500)
//     .height(220)
//    // .margins({top: 10, right: 50, bottom: 30, left: 50})
//     .x(d3.scale.ordinal().domain(review1))
//     .xUnits(dc.units.ordinal)
//     .group(totalDonationsState1)
//     .compose([reviewDistribution1,
//       reviewDistribution2
//     ]);
 
    

    dc.renderAll();

};