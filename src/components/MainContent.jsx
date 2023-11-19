import React from "react";

import "./MainContent.css";
import Prayer from "./Prayer";

import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import axios from "axios";
import { useState, useEffect } from "react";

import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainContent() {
    // State-5
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

    // State-1
    const [timings, settimings] = useState({
        Fajr: "04:20",
        Dhuhr: "11:50",
        Asr: "15:18",
        Sunset: "18:03",
        Isha: "19:33",
    });

    // State-2
    const [selectedCity, setSelectedCity] = useState({
        displayName: "مكة المكرمة",
        apiName: "Makkah al Mukarramah",
    });

    // State-3
    const [today, setToday] = useState("");

    // State-4
    // const [timer, setTimer] = useState(10);

    // State-6
    const [remainingTime, setRemainingTime] = useState("");


    const avilableCities = [
        {
            displayName: "مكة المكرمة",
            apiName: "Makkah al Mukarramah",
        },

        {
            displayName: "الرياض",
            apiName: "Riyadh",
        },

        {
            displayName: "الدمام",
            apiName: "Dammam",
        },
    ];

    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Sunset", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];

    const getTiming = async () => {
        console.log("call api");
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
        );
        settimings(response.data.data.timings);
    };

    // Effect-1
    useEffect(() => {
        getTiming();
    }, [selectedCity]);

    // Effect-2
    useEffect(() => {
        let Interval = setInterval(() => {
            console.log("call timer");

            setupCountdownTimer();
        }, 1000);

        const t = moment();
        setToday(t.format("MMM Do YYYY | h:mm"));

        return () => {
            clearInterval(Interval);
        };
    }, [timings]);

    const setupCountdownTimer = () => {
        const momentNow = moment();

        let prayerIndex = 2;

        if (
            momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
            momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
        ) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;
            remainingTime + totalDiffernce

        }

        console.log(remainingTime);

        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );

        console.log(
            "duration iss",
            durationRemainingTime.hours(),
            durationRemainingTime.minutes(),
            durationRemainingTime.seconds()
        );

        // console.log(momentNow.isBefore(moment(timings["Fajr"], "hh:mm")));
    };

    const handleCityChange = (event) => {
        const cityObject = avilableCities.find((city) => {
            return city.apiName == event.target.value;
        });
        // console.log("the new value is", event.target.value);
        setSelectedCity(cityObject);
    };

    return (
        <>
            {/* Top ROW */}
            <Grid container>
                <Grid xs={6}>
                    <div>
                        <h2 className="text_info"> {today} </h2>
                        <h1 className="text_info"> {selectedCity.displayName} </h1>

                        {/* <h2 className="text_info"> {timer} </h2> */}
                    </div>
                </Grid>

                <Grid xs={6}>
                    <div>
                        <h2 className="text_info">
                            متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
                        </h2>
                        <h1 className="text_info"> {remainingTime} </h1>
                    </div>
                </Grid>
            </Grid>

            <Divider style={{ borderColor: "" }} className="divider" />

            <Stack
                direction="row"
                justifyContent={"space-around"}
                className="stack_Prayer"
            >
                <Prayer name="الفجر" time={timings.Fajr} image="/public/fajr.png" />
                <Prayer name="الظهر" time={timings.Dhuhr} image="/public/dhhr.png" />
                <Prayer name="العصر" time={timings.Asr} image="/public/asr.png" />
                <Prayer
                    name="المغرب"
                    time={timings.Sunset}
                    image="/public/sunset.png"
                />
                <Prayer name="العشاء" time={timings.Isha} image="/public/night.png" />
            </Stack>

            <Stack
                direction="row"
                justifyContent={"space-around"}
                className="stack_Select"
            >
                <FormControl className="FormControl">
                    <InputLabel id="demo-simple-select-label">
                        <span className="span_city">المدينة</span>
                    </InputLabel>
                    <Select
                        className="Select"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Age"
                        onChange={handleCityChange}
                    >
                        {avilableCities.map((city) => {
                            return (
                                <MenuItem value={city.apiName} key={city.apiName}>
                                    {city.displayName}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Stack>
        </>
    );
}
