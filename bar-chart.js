function BarChart() {

    this.data = function (data) {
        if (arguments.length > 0) {
            this._data = data;
            return this;
        }
        return this._data;
    }

    this.selection = function (sel) {
        if (arguments.length > 0) {
            this._sel = sel;
            return this;
        }
        return this._sel;
    }

    this.size = function (size) {
        if (arguments.length > 0) {
            this._size = size;

            if (!this._margin) {
                console.error('Set the margins before setting the size');
            }

            this._chartSize = {
                w: this._size.w - this._margin.l - this._margin.r,
                h: this._size.h - this._margin.t - this._margin.b
            };

            return this;
        }
        return this._size;
    }

    this.margin = function (margin) {
        if (arguments.length > 0) {
            this._margin = margin;
            return this;
        }
        return this._margin;
    }

    this.filterState = function (state) {
        if (arguments.length > 0) {
            this._filterState = state;
            return this;
        }
        return this._filterState;
    }

    this.draw = function () {
        let filteredData = this._data.filter(d => d.state === this._filterState);

        let scaleX = d3.scaleBand()
            .domain(filteredData.map(d => d.county))
            .range([0, this._chartSize.w])
            .padding(0.3);

        let scaleY = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.deaths)])
            .range([this._chartSize.h, 0]);

        this._sel.attr('transform', `translate(${this._margin.l},${this._margin.t})`);
        
        let rectSelection = this._sel
            .selectAll('rect')
            .data(filteredData, (d, i) => i);
        rectSelection.enter()
            .append('rect')
            .attr('x', d => scaleX(d.county))
            .attr('y', this._chartSize.h)
            .attr('width', scaleX.bandwidth())
            .attr('height', 0)
            .transition()
            .duration(1000)
            .attr('y', d => scaleY(d.deaths))
            .attr('height', d => this._chartSize.h - scaleY(d.deaths));

        rectSelection.exit()
            .transition()
            .duration(1000)
            .attr('height', 0)
            .remove();
        
        rectSelection
            .transition()
            .duration(1000)
            .attr('x', d => scaleX(d.county))
            .attr('y', d => scaleY(d.deaths))
            .attr('width', scaleX.bandwidth())
            .attr('height', d => this._chartSize.h - scaleY(d.deaths));

        this._drawAxes(scaleX, scaleY);
    }

    this._drawAxes = function(scaleX, scaleY) {
        this._drawAxisX(scaleX);
        this._drawAxisY(scaleY);
    }

    this._drawAxisX = function(scaleX) {
        let axis = d3.axisBottom(scaleX);

        let axisG = this._sel.selectAll('g.axis-x')
            .data([1])
            .join('g')
            .classed('axis', true)
            .classed('axis-x', true)
            .attr('transform', `translate(0, ${this._chartSize.h})`);
        
        axisG.call(axis);
        
    }

    this._drawAxisY = function(scaleY) {
        let axis = d3.axisLeft(scaleY);

        let axisG = this._sel.selectAll('g.axis-y')
            .data([1])
            .join('g')
            .classed('axis', true)
            .classed('axis-y', true);
        
        axisG.call(axis);
    }

    this.dispatch = function (dispatch) {
        if (arguments.length > 0) {
            this._dispatch = dispatch;

            this._dispatch.on('changeState', (state) => {
                console.log(state);
                this.filterState(state)
                    .draw();
            })

            return this;
        }
        return this._dispatch;
    }
}


