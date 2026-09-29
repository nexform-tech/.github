NexForm Tech builds open hardware and software for embodied robotics; this
page maps the organization for developers, researchers and integrators.

<div align="center" style="background: linear-gradient(135deg, #1D4ED8 0%, #7C3AED 55%, #C026D3 100%); border-radius: 16px; padding: 40px 24px 36px; margin: 4px 0 28px;">

<h1 style="margin: 0 0 8px; border: 0; color: #FFFFFF; font-size: 2em; letter-spacing: 1px;">NEXFORM ROBOTICS</h1>

<p style="margin: 0 0 18px; color: #E0E7FF; font-size: 1.05em;">One stack from agent to actuator</p>

<img alt="Hardware: LiteArm, W1, LiteGrip" src="https://img.shields.io/badge/Hardware-LiteArm_%C2%B7_W1_%C2%B7_LiteGrip-D97706?labelColor=1F2937" style="margin: 2px;">
<img alt="SDKs: C++, Python" src="https://img.shields.io/badge/SDKs-C%2B%2B_%C2%B7_Python-2563EB?labelColor=1F2937" style="margin: 2px;">
<img alt="Simulation: Isaac Sim, MuJoCo, PyBullet" src="https://img.shields.io/badge/Simulation-Isaac_Sim_%C2%B7_MuJoCo_%C2%B7_PyBullet-059669?labelColor=1F2937" style="margin: 2px;">
<img alt="AI: LeRobot, VLA, DeepSeek, Hermes" src="https://img.shields.io/badge/AI_Agents-LeRobot_%C2%B7_VLA_%C2%B7_DeepSeek_%C2%B7_Hermes-7C3AED?labelColor=1F2937" style="margin: 2px;">

</div>

## Architecture

The stack reads top to bottom: agents decide, simulators test, ROS
integrates, SDKs communicate, hardware moves. Every card links into the
repository that implements it.

<div style="border: 1px solid rgba(124, 58, 237, 0.40); border-radius: 14px; background: linear-gradient(180deg, rgba(124, 58, 237, 0.10) 0%, rgba(124, 58, 237, 0.02) 100%); padding: 18px 22px;">

<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
<b style="color: #7C3AED; font-size: 15px;">AI / Agent layer</b>
<span style="color: #6B7280; font-size: 12px;">decide what to do next</span>
</div>

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

<a href="https://github.com/nexform-tech/litearm-lerobot" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #FFD21E; color: #1F2430; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">LeRobot · data collection and training</span></a>

<a href="https://github.com/nexform-tech/litearm-vla" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #7C3AED; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">VLA · pi0.5 and GR00T policies</span></a>

<a href="https://github.com/nexform-tech/litearm-dsh" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #4D6BFE; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">DeepSeek · model harness</span></a>

<a href="https://github.com/nexform-tech/litearm-hermes" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #0D9488; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">Hermes · agent platform</span></a>

</div>
</div>

<div align="center" style="color: #6B7280; font-size: 12px; padding: 6px 0;">↓ policies · ↑ rollouts and rewards</div>

<div style="border: 1px solid rgba(5, 150, 105, 0.40); border-radius: 14px; background: linear-gradient(180deg, rgba(5, 150, 105, 0.10) 0%, rgba(5, 150, 105, 0.02) 100%); padding: 18px 22px;">

<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
<b style="color: #059669; font-size: 15px;">Simulation layer</b>
<span style="color: #6B7280; font-size: 12px;">train and test before hardware</span>
</div>

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

<a href="https://github.com/nexform-tech/litearm-isaacsim" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #76B900; color: #1F2430; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">Isaac Sim · photoreal simulation</span></a>

<a href="https://github.com/nexform-tech/litearm-mujoco" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #D6493F; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">MuJoCo · fast and accurate dynamics</span></a>

<a href="https://github.com/nexform-tech/litearm-pybullet" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #475569; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">PyBullet · lightweight physics</span></a>

</div>
</div>

<div align="center" style="color: #6B7280; font-size: 13px; font-weight: 600; padding: 6px 0;">same API as the robot — simulation is drop-in for the SDK</div>

<div style="border: 1px solid rgba(79, 70, 229, 0.40); border-radius: 14px; background: linear-gradient(180deg, rgba(79, 70, 229, 0.10) 0%, rgba(79, 70, 229, 0.02) 100%); padding: 18px 22px;">

<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
<b style="color: #4F46E5; font-size: 15px;">ROS middleware layer</b>
<span style="color: #6B7280; font-size: 12px;">topics, motion planning and visualization in the standard ecosystem</span>
</div>

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

<a href="https://github.com/nexform-tech/litearm-ros1" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #22314E; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">ROS 1 · driver</span></a>

<a href="https://github.com/nexform-tech/litearm-ros2" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #334155; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">ROS 2 · driver</span></a>

<a href="https://github.com/nexform-tech/litearm-moveit1" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #0E7490; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">MoveIt 1 · motion planning</span></a>

<a href="https://github.com/nexform-tech/litearm-moveit2" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #0891B2; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">MoveIt 2 · motion planning</span></a>

</div>
</div>

<div align="center" style="color: #6B7280; font-size: 12px; padding: 6px 0;">ROS drivers wrap the SDK</div>

<div style="border: 1px solid rgba(37, 99, 235, 0.40); border-radius: 14px; background: linear-gradient(180deg, rgba(37, 99, 235, 0.10) 0%, rgba(37, 99, 235, 0.02) 100%); padding: 18px 22px;">

<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
<b style="color: #2563EB; font-size: 15px;">SDK layer</b>
<span style="color: #6B7280; font-size: 12px;">one interface in two languages</span>
</div>

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

<a href="https://github.com/nexform-tech/litearm-cpp" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #00599C; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">C++ SDK · real-time, zero dependencies</span></a>

<a href="https://github.com/nexform-tech/litearm-python" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #3776AB; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">Python SDK · primary interface</span></a>

</div>

</div>

<div align="center" style="color: #6B7280; font-size: 12px; padding: 6px 0;">↓ commands · ↑ state at 100 Hz over one USB serial cable</div>

<div style="border: 1px solid rgba(180, 83, 9, 0.40); border-radius: 14px; background: linear-gradient(180deg, rgba(180, 83, 9, 0.10) 0%, rgba(180, 83, 9, 0.02) 100%); padding: 18px 22px;">

<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
<b style="color: #B45309; font-size: 15px;">Hardware</b>
<span style="color: #6B7280; font-size: 12px;">the robots</span>
</div>

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

<a href="https://github.com/nexform-tech/litearm-docs" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #B45309; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">LiteArm · 7-axis manipulator</span></a>

<a href="https://github.com/nexform-tech/w1-docs" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #D97706; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">W1 · wheeled mobile robot</span></a>

<a href="https://github.com/nexform-tech/litegrip-docs" style="text-decoration: none;"><span style="display: inline-block; margin: 4px; background: #92400E; color: #FFFFFF; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">LiteGrip · lightweight gripper series</span></a>

</div>
</div>

## One-line install

| Runtime | Package | One-line install |
| --- | --- | --- |
| Python 3.9 or later | [litearm-python](https://github.com/nexform-tech/litearm-python) — imports as `litearm` | `pip install git+https://github.com/nexform-tech/litearm-python` |
| C++17 | [litearm-cpp](https://github.com/nexform-tech/litearm-cpp) | `git clone https://github.com/nexform-tech/litearm-cpp` |

No package is published on PyPI or npm yet, so the rows install from the
repositories; each repository's README documents its build and
requirements.

## Product lines

| Product | What it is | Documentation |
| --- | --- | --- |
| **LiteArm** | 7-axis robotic manipulator for education, research and consumer applications | [litearm-docs](https://github.com/nexform-tech/litearm-docs) |
| **W1** | Wheeled mobile robot | [w1-docs](https://github.com/nexform-tech/w1-docs) |
| **LiteGrip** | Lightweight robotic gripper series | [litegrip-docs](https://github.com/nexform-tech/litegrip-docs) |

## Repository layout

Each product line ships the same set of repositories, so knowing one
product means knowing all three:

| Repository suffix | Role |
| --- | --- |
| `-python` | Python SDK — the primary public interface |
| `-cpp` | C++ SDK |
| `-ros1`, `-ros2` | ROS 1 and ROS 2 drivers |
| `-docs` | Product documentation source, built and published as the documentation site |
| `-pybullet`, `-mujoco`, `-isaacsim` | Physics simulation environments |
| `-studio` | Cross-platform desktop studio, usable out of the box |
| `-urdf` | URDF models |
| `-vla` | VLA embodiment and data adaptation |
| `-lerobot`, `-moveit1`, `-moveit2` | Framework and middleware integrations |

## Where to start

| I want to | Go to |
| --- | --- |
| Understand a product | the `-docs` repository of that product line |
| Drive a robot from Python | [`litearm-python`](https://github.com/nexform-tech/litearm-python), [`w1-python`](https://github.com/nexform-tech/w1-python), [`litegrip-python`](https://github.com/nexform-tech/litegrip-python) |
| Simulate before buying | the `-mujoco`, `-pybullet` or `-isaacsim` repository of that product line |
| Integrate with ROS | the `-ros1` or `-ros2` repository of that product line |

<details>
<summary><b>How these repositories are maintained</b></summary>

Every repository in this organization follows one shared baseline:

- **[repo-template](https://github.com/nexform-tech/repo-template)** is the source of truth for the agent operating rules (`AGENTS.md`) and the release pipeline. It is the only place those rules are edited.
- Releases are automated with `semantic-release` from [Conventional Commits](https://www.conventionalcommits.org/): `feat` bumps the minor version, `fix` and `perf` bump the patch version, a `BREAKING CHANGE:` footer bumps the major version, and every other type releases nothing.
- The default branch is `main`. Changes land through a pull request that is squash merged by a repository owner.
- Repositories not listed in the tables above are integrations, experiments or infrastructure, and are not part of a product line.

</details>

---

<div align="center">

[github.com/nexform-tech](https://github.com/nexform-tech) · LiteArm · W1 · LiteGrip

</div>
