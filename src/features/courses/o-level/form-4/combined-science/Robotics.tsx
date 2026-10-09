import React from 'react';
import { NoteSection as Section, NoteImage, Idea, Check, NoteTable as Table } from './PhysicsNotes';
const Image = ({ name, caption }: { name: string; caption: string }) => <NoteImage topic="robotics" name={name} caption={caption} />;
const combinations = [[0,0],[0,1],[1,0],[1,1]];
export default function Robotics() { return <div className="not-prose space-y-6">
  <Idea><p>A robot follows a program to perform a task. It can collect information through sensors, make decisions using a controller, and act through motors or other actuators. Robotics brings these parts together.</p><p className="mt-3">Think about a robot that must avoid obstacles. What does it need to sense? What should its program decide? How will it move safely?</p></Idea>
  <Section title="1. Robots, their development and their parts">
    <Image name="types" caption="A fixed robot works from one location. A mobile robot can move between locations. Both need a controller, power and suitable moving parts." />
    <p><strong>Robotics</strong> is the study, design, construction and programming of robots. A <strong>robot</strong> is a programmable machine that carries out tasks, often using sensors and actuators. It does not have to look like a person.</p>
    <p>Early automatic machines used mechanical arrangements to repeat movements. Later, electric motors and electronic control made machines easier to control. Programmable industrial robots developed to repeat factory tasks. Improvements in microcontrollers, sensors and software then allowed more flexible mobile robots. Today robots can work in manufacturing, farming, medicine and exploration. Their abilities still depend on their design and program.</p>
    <p>A <strong>fixed robot</strong>, such as an arm bolted to a factory floor, works from one position even though its joints move. A <strong>mobile robot</strong> changes location, using wheels, tracks or legs. Classify examples by whether the whole robot moves from place to place, not just whether one part moves.</p>
    <Table headings={['Part', 'Role in a robot']} rows={[
      ['Motion sensor', 'Detects movement; provides an input to the controller.'], ['Microcontroller', 'Runs the program and handles inputs and outputs. Examples include ESP32, ESP8266 and STM32.'], ['Power source', 'Supplies energy, often from a battery.'], ['Gears', 'Transmit rotation and can change speed and turning effect.'], ['Motor driver', 'Uses controller signals to control the higher current needed by motors.'], ['Servo motor', 'Commonly moves to a controlled angle, such as a robot arm joint.'], ['Stepper motor', 'Moves in discrete steps for controlled positioning.'], ['D.c motor', 'Provides continuous rotation, such as driving wheels.'], ['Vibration motor', 'Produces vibration, such as an alert.'],
    ]} />
    <p>Look at a model robot and identify these parts. Follow the path from its battery to the controller and motor driver, then from the driver to its motors. A controller pin should not supply a motor’s large current directly.</p>
    <Check question="A robot arm rotates its joints but stays bolted to the floor. Is it fixed or mobile?"><p>It is fixed. Its parts move, but its base does not move between locations.</p></Check>
  </Section>
  <Section title="2. Safety and responsible use">
    <p>Moving parts can trap fingers, and a mobile robot can collide with people. Test at low speed in a clear area. Keep hands away from gears and joints. Secure the battery and wiring, use suitable power supplies, and include an accessible stop control. Disconnect power before adjusting moving parts.</p>
    <p>Test what happens when a sensor fails or gives an unexpected reading. A safe program should stop or enter a safe state rather than continue blindly. A robot must be tested with the conditions it will actually face.</p>
    <p><strong>Ethics</strong> concerns whether a use is responsible and fair. Cameras and sensors may collect personal information, so consider consent, privacy and secure storage. Consider who is responsible if a robot causes harm, how its decisions affect people, and how automation affects workers. Do not assume that a robot’s output is always correct or fair.</p>
    <Check question="A robot loses its distance-sensor reading while moving. What should a safe program do?"><p>Stop or move into a defined safe state, then report or handle the fault. Missing data should not be treated as proof that the path is clear.</p></Check>
  </Section>
  <Section title="3. Sensors detect; actuators act">
    <Image name="sensors" caption="Sensors provide information. Electric, hydraulic and pneumatic actuators turn control instructions into physical action." />
    <Table headings={['Sensor', 'What it detects / an example']} rows={[
      ['Temperature', 'Temperature; a robot checks whether equipment is too hot.'], ['Ultrasonic', 'Distance from echoes of high-frequency sound; a mobile robot detects an obstacle.'], ['Light', 'Light intensity; a robot follows light or detects a dark line.'], ['Pressure', 'Pressure or applied force; a gripper checks its grip.'], ['Proximity', 'Presence of a nearby object; a robot detects a part without touching it.'],
    ]} />
    <p>An ultrasonic sensor sends out a sound pulse and detects its echo. A longer return time means a greater distance. It measures the round trip, so the one-way distance is half the distance travelled by the pulse. Surface angle and material can affect the echo.</p>
    <p>An <strong>actuator</strong> produces an action. An electric actuator uses electrical energy, such as a motor turning a wheel. A hydraulic actuator uses pressurised liquid, commonly oil, to move a piston. A pneumatic actuator uses compressed gas, commonly air. These systems require suitable power and control; a sensor itself does not perform the movement.</p>
    <Idea>Input from a sensor → controller runs the program → output through a driver or control valve → actuator moves.</Idea>
    <Check question="Choose a sensor and actuator for a robot that opens a vent when a room is too hot."><p>Use a temperature sensor to measure the room temperature and an electric actuator, such as a servo, to move the vent. The controller compares the reading with a set value and commands the actuator.</p></Check>
  </Section>
  <Section title="4. Designing a robot before building it">
    <Image name="design" caption="Plan the structure, simulate its behaviour, then connect sensors, controller, motor driver and motors to carry out the task." />
    <p>Start by defining the task clearly. For an obstacle-avoiding robot, decide what counts as too close, how it will stop, and how it will choose a new direction. List the inputs, outputs and power needs before choosing components.</p>
    <p><strong>CAD</strong> means computer-aided design. Use it to plan the chassis, dimensions and positions of wheels, sensors and joints. <strong>Simulation software</strong> lets you test movements or control logic before making the physical robot. A simulation helps find mistakes, but real tests are still needed because friction, battery condition and sensor errors affect the actual machine.</p>
    <p>An Arduino board or other suitable microcontroller can run the control program. Arduino is a platform that includes boards and programming tools; ESP32, ESP8266 and STM32 are examples of microcontroller families. Choose the board and tools to suit the task.</p>
    <p>Use Scratch blocks to model a sequence such as “read distance, compare, move or stop”. A <strong>structured program</strong> uses sequence, decisions and repetition. Divide a larger task into smaller functions so its behaviour is easier to understand and test.</p>
    <Idea><p>Read distance → if invalid, stop → if too close, stop and turn → otherwise move forward → read again.</p><p className="mt-2">Repeated readings provide feedback, so the robot responds to changes instead of following one old reading.</p></Idea>
  </Section>
  <Section title="5. Logic gates and truth tables">
    <p>A logic gate takes binary inputs and gives a binary output. Here <strong>1 means true/on</strong> and <strong>0 means false/off</strong>. A truth table lists the output for every possible input combination. A NOT gate has one input; the gates below have two inputs, A and B.</p>
    <Table headings={['Gate', 'When its output is 1']} rows={[
      ['NOT', 'When its input is 0; it reverses the input.'], ['OR', 'When at least one input is 1, including when both are 1.'], ['AND', 'Only when both inputs are 1.'], ['NAND', 'Except when both inputs are 1; it is NOT-AND.'], ['NOR', 'Only when both inputs are 0; it is NOT-OR.'],
    ]} />
    <Table headings={['A', 'NOT A']} rows={[[0,1],[1,0]].map(r => r.map(String))} />
    <Table headings={['A', 'B', 'OR', 'AND', 'NAND', 'NOR']} rows={combinations.map(([a,b]) => [a,b,Number(Boolean(a||b)),Number(Boolean(a&&b)),Number(!Boolean(a&&b)),Number(!Boolean(a||b))].map(String))} />
    <p>For a robot allowed to move only when its path is clear <strong>and</strong> its guard is closed, use AND: both conditions must be true. For an alarm that activates if an obstacle is close <strong>or</strong> the temperature is too high, use OR. NOT can turn “obstacle detected” into “no obstacle detected”.</p>
    <Check question="If A = 1 and B = 0, find AND, OR, NAND and NOR."><p>AND = <strong>0</strong>; OR = <strong>1</strong>; NAND = <strong>1</strong>; NOR = <strong>0</strong>. NAND reverses AND, and NOR reverses OR.</p></Check>
  </Section>
  <Section title="6. Constructing and programming a robot">
    <p>Build a stable chassis, mount the wheels and motors, secure the sensor where it can detect the path, and connect a suitable controller, motor driver and power supply. Check the circuit with power off. Test one part at a time before combining everything.</p>
    <p>Python can express the control logic. The example below shows the structure of an obstacle-avoiding program. Its functions must be implemented with the libraries and pins for the chosen board; it is not a ready-to-upload program for every robot.</p>
    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100"><code>{`def choose_action(distance_cm):
    if distance_cm is None:
        return "stop"
    if distance_cm < 20:
        return "stop_and_turn"
    return "forward"

while robot_enabled():
    distance = read_distance_cm()
    action = choose_action(distance)
    apply_action(action)
    wait_briefly()

stop_motors()`}</code></pre>
    <p>The loop repeatedly reads the sensor. The decision uses a 20 cm example threshold. A missing reading gives a stop command. The motor-driver functions carry out the action, and the program stops the motors when the robot is disabled. In a real robot, define a safe turning sequence and read again before moving forward.</p>
    <p>Test with a far obstacle, a near obstacle and a disconnected sensor. Record expected and actual behaviour. Change one part of the design or program, then test again. Explain both the wiring and the program when describing how your robot performs its task.</p>
    <Check question="Why should a mobile robot keep reading its sensor while moving?"><p>The surroundings can change. Repeated readings give feedback so the controller can stop or change direction when a new obstacle appears.</p></Check>
  </Section>
</div>; }
