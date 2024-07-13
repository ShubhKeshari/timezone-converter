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

  useEffect(() => {
    const currentUtcMinutes =
      moment().utc().hours() * 60 + moment().utc().minutes();
    setTimezones((prevTimezones) =>
      prevTimezones.map((tz) => ({
        ...tz,
        time: moment()
          .utc()
          .startOf("day")
          .add(currentUtcMinutes + tz.offset * 60, "minutes"),
      }))
    );
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

  const handleTimeChange = (value, changedTimezone) => {
    setTimezones((prevTimezones) =>
      prevTimezones.map((tz) => {
        const newTime = moment()
          .utc()
          .startOf("day")
          .add(value * 15 + tz.offset * 60, "minutes");
        return tz.name === changedTimezone.name
          ? { ...tz, time: newTime }
          : {
              ...tz,
              time: newTime,
            };
      })
    );
  };

  const formatTime = (minutes, offset) => {
    const totalMinutes = (minutes + offset * 60 + 24 * 60) % (24 * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hrs >= 12 ? "PM" : "AM";
    const formattedHours = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${formattedHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const addTimezone = (name, offset) => {
    const currentUtcMinutes =
      moment().utc().hours() * 60 + moment().utc().minutes();
    const newTimezone = {
      id: timezones.length + 1,
      name,
      offset,
      time: moment()
        .utc()
        .startOf("day")
        .add(currentUtcMinutes + offset * 60, "minutes"),
    };
    setTimezones([...timezones, newTimezone]);
    setSelectedTimezone("");
  };

  const sliderLabels = [];
  for (let i = 0; i <= 24 * 60; i += 180) {
    const hour = (i / 60) % 24;
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
    const utcMinutes = (totalMinutes - timezone.offset * 60 + 24 * 60) % (24 * 60);
    handleTimeChange(Math.floor(utcMinutes / 15), timezone);
  };

  const getTimeOptions = (timezone) => {
    const options = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const formattedTime = formatTime(i, timezone.offset);
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
              const selectedTimezone = timezonesList.find(tz => tz.name === e.target.value);
              if (selectedTimezone) {
                addTimezone(selectedTimezone.name, selectedTimezone.offset);
              }
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
                              {formatTime(
                                timezone.time.hours() * 60 + timezone.time.minutes(),
                                0
                              )}
                            </Text>
                            <Select
                              value={formatTime(
                                timezone.time.hours() * 60 + timezone.time.minutes(),
                                timezone.offset
                              )}
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
                            max={24 * 60 / 15 - 1}
                            step={1}
                            onChange={(value) =>
                              handleTimeChange(value, timezone)
                            }
                            value={
                              (timezone.time.hours() * 60 + timezone.time.minutes()) / 15
                            }
                            mt={4}
                            h={8}
                          >
                            <SliderTrack h={8}>
                            </SliderTrack>
                            <SliderThumb boxSize={8} borderRadius="sm" grabbable>
                              <Box color="blue.500" fontSize="xs">
                                {moment()
                                  .startOf("day")
                                  .add(
                                    timezone.time.hours() * 60 +
                                      timezone.time.minutes(),
                                    "minutes"
                                  )
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

