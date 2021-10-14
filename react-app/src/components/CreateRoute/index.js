import React, {useEffect, useState, useRef} from "react"
import { useSelector, useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./CreateRoute.css"
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { setRuns } from '../../store/runs';
import {useLocation} from "react-router-dom"
import { editRun } from "../../store/runs";


const CreateRoute = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [startPoint,updateStartPoint] = useState("")
    const [endPoint,updateEndPoint] = useState("")
    const [distance,setDistance] = useState("")
    const [time,setTime] = useState("")
    const [formFilled,toggleFormFilled] = useState(false)
    const currentUser = useSelector(state=>state.session.user)

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmVuYmFybmV0dDEiLCJhIjoiY2t0a2w1bDh1MW13cjJvbnh2Nm4xeHg4ZSJ9.tfF8CCQtdVQSCHxliRtaQQ';

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState("");
    const [lat, setLat] = useState("");
    const [zoom, setZoom] = useState(9);
    const [data,setData] = useState("")
    console.log("LOCATION STATE OUTER ",location.state)
    useEffect(()=>{
        console.log("LOCATION STATE INNER ",location.state)
        if(!location.state)return
        setData(location.state)
        console.log("STATE INNER",data)
    },[])
    console.log("STATE OUTER",data)
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(function(position) {
            updateStartPoint(`${position.coords.latitude},${position.coords.longitude}`)
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
        });

    },[])

        useEffect(() => {
            if (map.current) return; // initialize map only once
            if(lng && lat){
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [lng, lat],
                    zoom: zoom
                });
                map.current.directions = new MapboxDirections({
                    accessToken: mapboxgl.accessToken,
                    unit: 'imperial',
                    profile: 'mapbox/walking'
                  });
                  map.current.addControl(map.current.directions, 'top-left');
                map.current.directions.on("route", e => {
                    // routes is an array of route objects as documented here:
                    // https://docs.mapbox.com/api/navigation/#route-object
                    let routes = e.route

                    let distance = routes.map(r => r.distance) * 0.621371 / 1000;
                    console.log("distance: ",distance)
                    updateStartPoint(`${map.current.directions.getOrigin().geometry.coordinates[0]},${map.current.directions.getOrigin().geometry.coordinates[1]}`)
                    updateEndPoint(`${map.current.directions.getDestination().geometry.coordinates[0]},${map.current.directions.getDestination().geometry.coordinates[1]}`)
                    setDistance(distance)
                    setTime(distance*60*8)

                })

        }
        });

        useEffect(()=>{
            if(startPoint && endPoint && distance && time){
                toggleFormFilled(true)
            } else toggleFormFilled(false)
        },[startPoint,endPoint,time,distance])

        const onSubmit = (e) => {
            if(startPoint && endPoint && distance && time){
                if(data){
                    dispatch(editRun(data.id,currentUser.id,startPoint,endPoint,distance,time))
                }
                else{
                    dispatch(setRuns(currentUser.id,startPoint,endPoint,distance,time))
                }
            }
        }
        useEffect(() => {
            if (!map.current) return; // wait for map to initialize
            map.current.on('move', () => {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            });
        });


        return (
            <div id = "create-route-page">
                {formFilled && (
                <form onSubmit={onSubmit}>
                    {data ? (
                        <button id = "create-route-submit" type="submit">Edit Run</button>
                    ) : (
                        <button id = "create-route-submit" type="submit">Create Run</button>
                    )}

                </form>
                )}
                <div ref={mapContainer} className="map-container" />
            </div>

        )
}

export default CreateRoute
