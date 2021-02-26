const margins = {t: 50, r: 50, b: 50, l: 50};
const size = {w: window.innerWidth, h: window.innerHeight*0.6};
const svg = d3.select('svg#bar-chart');
const containerG = svg.append('g');
const dispatch = d3.dispatch('changeState');

svg.attr('width', size.w)
    .attr('height', size.h);

d3.csv('data/covid_data.csv')
    .then(function(data) {

        data = data.map(d => {
            d.cases = +d.cases;
            d.fips = +d.fips;
            d.deaths = +d.deaths;
            d.lat = +d.lat;
            d.long = +d.long;
            return d;
        });

        let states = new Set(data.map(d => d.state));
        states = Array.from(states);
        states = states.sort();
        
        // BAR CHART
        let barChart = new BarChart();

        barChart
            .margin(margins)
            .size(size)
            .selection(containerG)
            .data(data)
            .filterState(states[0])
            .dispatch(dispatch)
            .draw();


        // ANNOTATIONS
        let scrollActions = new ScrollActions();
        scrollActions
            .dispatch(dispatch)
            .addScrollTriggers();

});
