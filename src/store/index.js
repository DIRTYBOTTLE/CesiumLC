import { createStore } from 'vuex'
import Dem from 'assets/dem.png'
import Imagery from 'assets/imagery.png'
import Vector from 'assets/vector.png'
import Model from 'assets/model.png'

const store = createStore({
    state() {
        return {
            baseUrl: 'http://localhost:4000',
            imgSrc: [
                {
                    name: 'DEM',
                    src: Dem
                },
                {
                    name: 'DOM',
                    src: Imagery
                },
                {
                    name: 'Vector',
                    src: Vector
                },
                {
                    name: 'Model',
                    src: Model
                }
            ],
            data: [],
            service: [],
            cesiumToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmU1YzgyNC02NGE4LTQxZWYtYTllYy1iOGFlNGM3Mjc0OWQiLCJpZCI6MzQ1NzAsImlhdCI6MTYwMDQ5NTQ5Mn0.EJq4uI-vcVSNJpywSI3YH3RXRlvz3h9G6aMzRn5C4B8',
            mapboxToken: 'pk.eyJ1IjoiaWxsdXNpb25kcmVhbSIsImEiOiJjazQ1Nm9jZzkwNmE3M2tuNmpqajRjc2lxIn0.4yZ7cB1IiaW5w1Cbn3ZXiA',
        }
    },
    mutation: {
        test(state) {
            console.log(state.baseUrl)
        }
    }
})

export default store