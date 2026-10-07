<div align="center">

# NEXFORM ROBOTICS

**Robot hardware and software, from the servo loop to embodied AI.**

<img alt="Hardware: LiteArm, W1, LiteGrip" src="https://img.shields.io/badge/Hardware-LiteArm_%C2%B7_W1_%C2%B7_LiteGrip-D97706?labelColor=1F2937&style=flat-square">
<img alt="SDKs: Python, C++, JavaScript" src="https://img.shields.io/badge/SDKs-Python_%C2%B7_C%2B%2B_%C2%B7_JavaScript-2563EB?labelColor=1F2937&style=flat-square">
<img alt="Simulation: MuJoCo, PyBullet, Isaac Sim" src="https://img.shields.io/badge/Simulation-MuJoCo_%C2%B7_PyBullet_%C2%B7_Isaac_Sim-059669?labelColor=1F2937&style=flat-square">
<img alt="Embodied AI: VLA, LeRobot, agent platforms" src="https://img.shields.io/badge/Embodied_AI-VLA_%C2%B7_LeRobot_%C2%B7_Agent_platforms-7C3AED?labelColor=1F2937&style=flat-square">

[Website](https://www.nexform.tech) · [The stack](#the-stack) · [Where to start](#where-to-start)

</div>

---

This page maps the NEXFORM ROBOTICS organization for developers, researchers and
integrators. We build three product lines (LiteArm manipulators, W1 mobile robots
and LiteGrip grippers) and publish every one of them as the same six-layer stack,
so learning one product line means knowing all three.

Repositories are named `<product>-<layer>`. Pick a product, then the layer that
matches what you are doing.

## The stack

Each layer uses the one below it: an application drives a policy, the policy plans
a motion, the planner commands a driver, and the driver reaches the hardware
through the model that simulation has already validated.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/stack-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/stack-light.svg">
  <img alt="The NEXFORM stack: six layers, from applications and documentation at the top to robot hardware at the bottom" src="assets/stack-light.svg">
</picture>

## Where to start

| I want to | Go to |
| --- | --- |
| Understand a product | its `-docs` repository |
| Drive a robot from Python or C++ | its `-python` or `-cpp` repository |
| Use a desktop application | its `-studio` repository |
| Plan motion or work inside ROS | its `-ros1`, `-ros2`, `-moveit1` or `-moveit2` repository |
| Simulate before buying hardware | its `-mujoco`, `-pybullet` or `-isaacsim` repository |
| Train or run a learned policy | its `-vla` or `-lerobot` repository |

## License

Every product repository is licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Copyright ©
2026 NEXFORM ROBOTICS.

<div align="center">

[github.com/nexform-tech](https://github.com/nexform-tech) · [www.nexform.tech](https://www.nexform.tech) · LiteArm · W1 · LiteGrip

</div>
