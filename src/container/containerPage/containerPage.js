import React, {Component} from 'react';
import InputRange from 'react-input-range';
import DatePicker from 'react-datepicker/lib/datepicker';
import moment from 'moment';
import classNames from 'classnames';

//* CSS STYLES FROM COMPONENTS **//
import 'react-input-range/lib/css/index.css';
import '../../stylesheet/react-datepicker.css'
import './containerPage.scss';

// Data Source JSON Format
import flightsData from '../../utility/dataSource'

class ContainerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oneWay: false,
            twoWay: true,
            departureDate: moment(),
            returnDate: moment().add(1, 'day'),
            passengerCount: 1,
            errorMessage: '',
            disableDatePicker: false,
            finalFlightSearchInput: [],
            showFilteredData: false,
            finalResults: [],
            priceFilter: [],
            originalData: true,
            noSearchResult: false,
            noSearchResultMessage: '',
            price: {
                min: 500,
                max: 8600,
            },
        };
        this.changeDepartureDate = this.changeDepartureDate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    oneWaySearch() {
        this.setState({
            oneWay: true,
            twoWay: false,
            disableDatePicker: true,
        })
    }
    twoWaySearch() {
        this.setState({
            oneWay: false,
            twoWay: true,
            disableDatePicker: false,
        })
    }
    changeDepartureDate(departureDate) {
        this.setState({departureDate: moment(departureDate._d)});
    }

    changeReturnDate(returnDate){
        this.setState({returnDate: moment(returnDate._d)});
    }

    decrement() {
        let counter = this.state.passengerCount;
        if (counter > 0) {
            this.setState({
                passengerCount: this.state.passengerCount - 1,
            });
        }
    }
    increment() {
        this.setState({
            passengerCount: this.state.passengerCount + 1,
        })
    }

    handleSearch(){
        this.setState({
            showFilteredData: true,
            priceFilteredData: false,
            originalData: false,
        });
        var flightSearchInputs = [];
        flightSearchInputs = {
            oneWay : this.state.oneWay,
            originCity: this.originCity.value,
            destinationCity: this.destinationCity.value,
            departureDate: this.state.departureDate._d,
            returnDate: this.state.returnDate._d,
            passengerCount: this.state.passengerCount,
        };

        let oCity = flightSearchInputs.originCity;
        let dCity = flightSearchInputs.destinationCity;

        if(oCity.length > 0 && dCity.length > 0){
            const fetchedData = flightsData.filter((ds) => {
                const ipOriginCity = flightSearchInputs.originCity.toUpperCase();
                const ipdestinationCity = flightSearchInputs.destinationCity.toUpperCase();
                let departDate = new Date(ds.departDate);
                let dDate = departDate.toLocaleDateString();
                let arrivalDate = new Date(ds.arriveDate);
                let aDate = arrivalDate.toLocaleDateString();
                const ipdDate = new Date(flightSearchInputs.departureDate);
                const ipDate = ipdDate.toLocaleDateString();
                const ipaDate = new Date(flightSearchInputs.returnDate);
                const iparrDate = ipaDate.toLocaleDateString();
                if(this.state.oneWay === true){
                    return ds.origin === ipOriginCity && ds.destination === ipdestinationCity && dDate === ipDate && ds.price >= this.state.price.min && ds.price <= this.state.price.max;
                }
                return ds.origin === ipOriginCity && ds.destination === ipdestinationCity && dDate === ipDate && aDate === iparrDate && ds.price >= this.state.price.min && ds.price <= this.state.price.max;
            });

            if(fetchedData.length === 0 ){
                this.setState({
                    noSearchResult : true,
                    noSearchResultMessage: 'No Flights Available',
                })
            }else{
                this.setState({
                    noSearchResult : false,
                    noSearchResultMessage: '',
                })
            }
            this.setState({
                finalResults : fetchedData,
                errorMessage : '',
            });

        }else{
            this.setState({
                errorMessage : 'Please enter all the input fields.',
            })
        }
    }
    render() {
        return (
            <div className="container clearfix">
                <div className="section">
                    <div className="flightFilter clearfix">
                        <div className="searchTypes clearfix">
                            <ul>
                                <li className={classNames('tripType',this.state.oneWay ?  'tripSelected' : '')}
                                    onClick={this.oneWaySearch.bind(this)}>
                                    One Way
                                </li>
                                <li className={classNames('tripType', 'returnTrip',this.state.twoWay ?  'tripSelected' : '' )}
                                    onClick={this.twoWaySearch.bind(this)}>
                                    Return
                                </li>
                            </ul>
                        </div>

                        <div className="form flightFilterForm">
                            <div className="inputContainer inputCity">
                                <input className="input"
                                       type="text" placeholder="Enter Origin City"
                                       ref={node => {
                                           this.originCity = node;
                                       }}
                                />
                            </div>

                            <div className="inputContainer inputCity">
                                <input className="input"
                                       type="text"
                                       placeholder="Enter Destination City"
                                       ref={node => {
                                           this.destinationCity = node;
                                       }}
                                />
                            </div>

                            <div className="dateContainer clearfix">
                               <ul>
                                   <li>
                                       <h4 className="calenderTitle">Departure <span>date</span></h4>
                                       <DatePicker
                                           className="input datePicker datepick"
                                           selected={this.state.departureDate}
                                           excludeDates={[moment(), moment().subtract(10, "days")]}
                                           onChange={this.changeDepartureDate.bind(this)}
                                           minDate={moment()}
                                       />
                                   </li>
                                    <li>
                                        <h4 className="calenderTitle">Return <span>date</span></h4>
                                        <DatePicker
                                            className={classNames('input', 'datePicker', 'datepick',this.state.disableDatePicker ?  'opacitDim' : '' )}
                                            selected={this.state.returnDate}
                                            onChange={this.changeReturnDate.bind(this)}
                                            minDate={moment()}
                                            disabled={this.state.disableDatePicker}
                                            />
                                    </li>
                               </ul>
                            </div>

                            <dis className="passengersContainer clearfix">
                                <h4 className="passengerTitle">Passengers</h4>
                                <div className="countBtns">
                                    <ul>
                                        <li onClick={ () => this.decrement(this.state.passengerCount)} className="minus"> </li>
                                        <li className="passengerCount">{this.state.passengerCount}</li>
                                        <li onClick={ () => this.increment(this.state.passengerCount)} className="plus"> </li>
                                    </ul>
                                </div>
                            </dis>
                            <div className="error errorMessage"><span>{this.state.errorMessage}</span></div>
                            <div className="buttonContainer">
                                <button className="button" type="submit"
                                        onClick={()=>this.handleSearch()}
                                >Search</button>
                            </div>
                        </div>
                        <div className="priceRangeContainer">
                            <h4>Refine flight search</h4>
                            <InputRange
                                className="priceRange"
                                maxValue={10000}
                                minValue={0}
                                formatLabel={price => `₹ ${price}`}
                                value={this.state.price}
                                onChange={price => this.setState({price})}
                                onChangeComplete={ () => this.handleSearch()}
                               />
                        </div>
                    </div>
                </div>

                <div className="containerPage">
                    <div className="content">
                        {this.state.noSearchResult ? <div className="contentPage clearfix">
                        <div className="contentHeader clearfix">
                            <div className="title routeTitle">
                                <h4> { this.state.noSearchResultMessage} </h4>
                            </div>
                        </div>
                    </div>: null}
                        { this.state.finalResults.map((data) => {
                        let departDate = new Date(data.departDate);
                        let dDate = departDate.toLocaleDateString();
                        let arriveDate = new Date(data.arriveDate);
                        let aDate = arriveDate.toLocaleDateString();
                        let rdepartDate = new Date(data.returnTrip.departDate);
                        let rdDate = rdepartDate.toLocaleDateString();
                        let rarriveDate = new Date(data.returnTrip.arriveDate);
                        let raDate = rarriveDate.toLocaleDateString();
                        return(
                            <div className="contentPage clearfix">
                                <div className="flightsAvailable">
                                    <div className="flightAvailableHeader">
                                        <h4 className="flightName"> Rs. {data.price}</h4>
                                    </div>
                                    <div className="flightDetailContainer clearfix">
                                        <div className="flightsDeparture">
                                            <p>{data.number}</p>
                                            <h5>
                                                <span>{data.originCode}</span>
                                                <span class="char"> ⤔ </span>
                                                <span>{data.destinationCode}</span>
                                            </h5>
                                            <h4>Depart: <span>{dDate}</span></h4>
                                            <h4>Arrive: <span>{aDate}</span></h4>
                                        </div>
                                        { !this.state.oneWay ? <div className="flightsDeparture flightsArrive">
                                            <p>AI- 202</p>
                                            <h5>
                                                <span> {data.destinationCode}</span>
                                                <span class="char"> ⤔ </span>
                                                <span>{data.originCode}</span>
                                            </h5>
                                            <h4>Departure: <span>{rdDate}</span></h4>
                                            <h4>Arrive: <span>{raDate}</span></h4>
                                        </div> : null}
                                        <div className="flightImage lastItem">
                                            <div className="buttonContainer bookFlightButton">
                                                <button href="#" className="">Book this Flight</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
        );
    }
}

export default ContainerPage;
