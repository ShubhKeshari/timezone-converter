// import React, { useState } from 'react';
// import {
//   Box,
//   Flex,
//   Select,
//   Slider,
//   SliderTrack,
//   SliderFilledTrack,
//   SliderThumb,
//   Text,
//   IconButton,
//   useColorMode,
//   Button
// } from '@chakra-ui/react';
// import { FaCalendarAlt } from 'react-icons/fa';
// import { MdOutlineSwapVert, MdClose } from 'react-icons/md';
// import { IoIosLink, IoIosMoon } from 'react-icons/io';
// import { LuSunMoon } from 'react-icons/lu';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const timezonesList = [
//   { name: 'UTC', offset: 0 },
//   { name: 'IST', offset: 5.5 },
//   { name: 'EST', offset: -5 },
//   { name: 'PST', offset: -8 },
//   { name: 'CET', offset: 1 },
//   { name: 'EET', offset: 2 },
//   { name: 'JST', offset: 9 },
//   { name: 'AEST', offset: 10 },
//   { name: 'AKST', offset: -9 },
//   { name: 'MSK', offset: 3 },
// ];

// const Home = () => {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [timezones, setTimezones] = useState([]);
//   const [selectedTimezone, setSelectedTimezone] = useState('');

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const newOrder = Array.from(timezones);
//     const [moved] = newOrder.splice(result.source.index, 1);
//     newOrder.splice(result.destination.index, 0, moved);
//     setTimezones(newOrder);
//   };

//   const handleRemove = (name) => {
//     setTimezones(timezones.filter(tz => tz.name !== name));
//   };

//   const handleTimeChange = (value) => {
//     setTimezones(timezones.map(tz => ({ ...tz, time: value })));
//   };

//   const formatTime = (minutes, offset) => {
//     const totalMinutes = (minutes + offset * 60 + 1440) % 1440;
//     const hours = Math.floor(totalMinutes / 60);
//     const mins = totalMinutes % 60;
//     const period = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//     return `${formattedHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
//   };

//   const addTimezone = (timezoneName) => {
//     if (timezoneName && !timezones.some(tz => tz.name === timezoneName)) {
//       const timezone = timezonesList.find(tz => tz.name === timezoneName);
//       setTimezones([...timezones, { ...timezone, time: 0 }]);
//       setSelectedTimezone('');
//     }
//   };

//   return (
//     <Box m={4} p={4} borderWidth="1px" borderRadius="lg">
//       <Flex mb={4} justifyContent="space-between" alignItems="center">
//         <Select
//           w="200px"
//           value={selectedTimezone}
//           onChange={(e) => {
//             setSelectedTimezone(e.target.value);
//             addTimezone(e.target.value);

//           }}

//         >
//           <option value="" disabled>Select a timezone</option>
//           {timezonesList.map(tz => (
//             <option key={tz.name} value={tz.name}>{tz.name}</option>
//           ))}
//         </Select>
//         <Box display="flex" alignItems="center">
//           <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
//           <FaCalendarAlt />
//         </Box>
//         <Flex gap="5px">
//           <Button>
//             <MdOutlineSwapVert />
//           </Button>
//           <Button>
//             <IoIosLink />
//           </Button>
//           <Button aria-label="Toggle Color Mode" onClick={toggleColorMode}>
//             {colorMode === 'light' ? <IoIosMoon /> : <LuSunMoon />}
//           </Button>
//         </Flex>
//       </Flex>
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="timezones">
//           {(provided) => (
//             <Box ref={provided.innerRef} {...provided.droppableProps}>
//               {timezones.map((timezone, index) => (
//                 <Draggable key={timezone.name} draggableId={timezone.name} index={index}>
//                   {(provided) => (
//                     <Flex
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       alignItems="center"
//                       justifyContent="space-between"
//                       mb={4}
//                       p={4}
//                       bg="gray.100"
//                       borderRadius="md"
//                       flexDirection="column"
//                       position="relative"
//                     >
//                       <Box w="100%">
//                         <Flex justifyContent="space-between" alignItems="center">
//                           <Text fontSize="lg" fontWeight="bold">{timezone.name}</Text>
//                           <IconButton
//                             icon={<MdClose />}
//                             aria-label="Remove timezone"
//                             onClick={() => handleRemove(timezone.name)}
//                             position="absolute"
//                             top={2}
//                             right={2}
//                           />
//                         </Flex>
//                         <Flex justifyContent="space-between" alignItems="center" mt={2}>
//                           <Text>{formatTime(timezone.time, timezone.offset)}</Text>
//                           <Select
//                             value={formatTime(timezone.time, timezone.offset)}
//                             onChange={(e) => {
//                               const [hours, minutes] = e.target.value.split(':').map(Number);
//                               const newTime = (hours * 60 + minutes) - timezone.offset * 60;
//                               handleTimeChange(newTime);
//                             }}
//                             fontWeight="bold"
//                             w="auto"
//                             pl={2}
//                             pt={2}
//                           >
//                             {Array.from({ length: 24 * 4 }, (_, i) => {
//                               const totalMinutes = i * 15;
//                               const hours = Math.floor(totalMinutes / 60);
//                               const minutes = totalMinutes % 60;
//                               const period = hours >= 12 ? 'PM' : 'AM';
//                               const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//                               return (
//                                 <option key={i} value={`${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`}>
//                                   {`${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`}
//                                 </option>
//                               );
//                             })}
//                           </Select>
//                         </Flex>
//                         <Slider
//                           defaultValue={0}
//                           min={0}
//                           max={1440}
//                           step={15}
//                           onChange={handleTimeChange}
//                           value={timezone.time}
//                           mt={4}
//                           h={8}
//                         >
//                           <SliderTrack h={8}>
//                             <SliderFilledTrack />
//                           </SliderTrack>
//                           <SliderThumb boxSize={8} borderRadius="sm" />
//                         </Slider>
//                         <Flex justifyContent="space-between" mt={2}>
//                           {Array.from({ length: 9 }, (_, i) => (
//                             <Text key={i}>{(i * 3) % 12 || 12} {(i * 3) >= 12 ? 'PM' : 'AM'}</Text>
//                           ))}
//                         </Flex>
//                       </Box>
//                     </Flex>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </Box>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </Box>
//   );
// };

// export {Home};

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  IconButton,
  useColorMode,
  Button,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineSwapVert, MdClose } from "react-icons/md";
import { IoIosLink, IoIosMoon } from "react-icons/io";
import { LuSunMoon } from "react-icons/lu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import "react-datepicker/dist/react-datepicker.css";

const timezonesList = [
  { name: "UTC", offset: 0 },
  { name: "IST", offset: 5.5 },
  { name: "EST", offset: -5 },
  { name: "PST", offset: -8 },
  { name: "CET", offset: 1 },
  { name: "EET", offset: 2 },
  { name: "JST", offset: 9 },
  { name: "AEST", offset: 10 },
  { name: "AKST", offset: -9 },
  { name: "MSK", offset: 3 },
];

const Home = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [baseTime, setBaseTime] = useState(
    moment().utc().hours() + moment().utc().minutes() / 60
  );

  useEffect(() => {
    const currentUtcHours =
      moment().utc().hours() + moment().utc().minutes() / 60;
    setBaseTime(currentUtcHours);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(timezones);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setTimezones(newOrder);
  };

  const handleRemove = (name) => {
    setTimezones(timezones.filter((tz) => tz.name !== name));
  };

  const handleTimeChange = (value) => {
    setBaseTime(value);
  };

  const formatTime = (hours, offset) => {
    const totalHours = (hours + offset + 24) % 24;
    const hrs = Math.floor(totalHours);
    const mins = Math.round((totalHours - hrs) * 60);
    const period = hrs >= 12 ? "PM" : "AM";
    const formattedHours = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${formattedHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const addTimezone = (timezoneName) => {
    if (timezoneName && !timezones.some((tz) => tz.name === timezoneName)) {
      const timezone = timezonesList.find((tz) => tz.name === timezoneName);
      setTimezones([
        ...timezones,
        { ...timezone, time: moment().utc().add(timezone.offset, "hours") },
      ]);
      setSelectedTimezone("");
    }
  };

  const sliderLabels = [];
  for (let i = 0; i <= 24; i += 3) {
    const hour = i % 24;
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    sliderLabels.push(
      `${formattedHour.toString().padStart(2, "0")}:00 ${period}`
    );
  }

  const handleSelectChange = (event, timezone) => {
    const [time, period] = event.target.value.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let newHours = hours % 12;
    if (period === "PM") {
      newHours += 12;
    }
    const totalMinutes = newHours * 60 + minutes;
    const totalHours = newHours + minutes / 60;
    const utcHours = (totalHours - timezone.offset + 24) % 24;
    handleTimeChange(utcHours);
  };

  const getTimeOptions = (timezone) => {
    const options = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const minutes = i;
      const hours = minutes / 60;
      const formattedTime = formatTime(hours, timezone.offset);
      options.push(
        <option key={i} value={formattedTime}>
          {formattedTime}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      <Heading textAlign={"center"} mt={8}>Timezone Converter</Heading>
      <Box ml={16} mr={16} mt={4} p={4} borderWidth="1px" borderRadius="lg">
        <Flex mb={4} justifyContent="space-between" alignItems="center">
          <Select
            w="300px"
            value={selectedTimezone}
            onChange={(e) => {
              setSelectedTimezone(e.target.value);
              addTimezone(e.target.value);
            }}
          >
            <option value="" disabled>
              Select a timezone
            </option>
            {timezonesList.map((tz) => (
              <option key={tz.name} value={tz.name}>
                {tz.name}
              </option>
            ))}
          </Select>

          <Box
            display="flex"
            alignItems="center"
            bg={useColorModeValue("white", "gray.800")}
            p={"7px"}
            borderRadius="md"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="custom-datepicker"
            />
            <FaCalendarAlt />
          </Box>
          <Flex gap="10px">
            <Button>
              <MdOutlineSwapVert />
            </Button>
            <Button>
              <IoIosLink />
            </Button>
            <Button aria-label="Toggle Color Mode" onClick={toggleColorMode}>
              {colorMode === "light" ? <IoIosMoon /> : <LuSunMoon />}
            </Button>
          </Flex>
        </Flex>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="timezones">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {timezones.map((timezone, index) => (
                  <Draggable
                    key={timezone.name}
                    draggableId={timezone.name}
                    index={index}
                  >
                    {(provided) => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        alignItems="center"
                        justifyContent="space-between"
                        mb={4}
                        p={4}
                        bg={useColorModeValue("gray.100", "gray.700")}
                        borderRadius="md"
                        flexDirection="column"
                        position="relative"
                      >
                        <Box w="100%">
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text fontSize="lg" fontWeight="bold">
                              {timezone.name}
                            </Text>
                            <IconButton
                              icon={<MdClose />}
                              aria-label="Remove timezone"
                              onClick={() => handleRemove(timezone.name)}
                              position="absolute"
                              top={2}
                              right={2}
                            />
                          </Flex>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
                          >
                            <Text fontWeight="bold" fontSize="xl">
                              {formatTime(baseTime, timezone.offset)}
                            </Text>
                            <Select
                              value={formatTime(baseTime, timezone.offset)}
                              onChange={(e) => handleSelectChange(e, timezone)}
                              fontWeight="bold"
                              w="auto"
                              pl={2}
                              pt={2}
                            >
                              {getTimeOptions(timezone)}
                            </Select>
                          </Flex>
                          <Slider
                            min={0}
                            max={24}
                            step={0.25}
                            onChange={handleTimeChange}
                            value={baseTime}
                            mt={4}
                            h={8}
                          >
                            <SliderTrack h={8}>
                              {/* <SliderFilledTrack /> */}
                            </SliderTrack>
                            <SliderThumb boxSize={8} borderRadius="sm">
                              <Box color="blue.500" fontSize="xs">
                                {moment()
                                  .startOf("day")
                                  .add(baseTime, "hours")
                                  .format("h:mm A")}
                              </Box>
                            </SliderThumb>
                          </Slider>
                          <Flex justifyContent="space-between" mt={2}>
                            {sliderLabels.map((label, i) => (
                              <Text key={i}>{label}</Text>
                            ))}
                          </Flex>
                        </Box>
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </>
  );
};

export { Home };
