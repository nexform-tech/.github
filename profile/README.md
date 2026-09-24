# NEXFORM ROBOTICS

Open hardware and software for robotics: the **LiteArm** robotic manipulator
series, the **W1** wheeled mobile robot, and the **LiteGrip** lightweight
gripper series.

## Product lines

| Product | What it is | Documentation |
| --- | --- | --- |
| **LiteArm** | 7-axis robotic manipulator for education, research and consumer applications | [litearm-docs](https://github.com/nexform-tech/litearm-docs) |
| **W1** | Wheeled mobile robot | [w1-docs](https://github.com/nexform-tech/w1-docs) |
| **LiteGrip** | Lightweight robotic gripper series | [litegrip-docs](https://github.com/nexform-tech/litegrip-docs) |

Each product line ships the same set of repositories, so knowing one product
means knowing all three:

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

## How these repositories are maintained

Every repository in this organization follows one shared baseline:

- **[repo-template](https://github.com/nexform-tech/repo-template)** is the
  source of truth for the agent operating rules (`AGENTS.md`) and the release
  pipeline. It is the only place those rules are edited.
- Releases are automated with `semantic-release` from
  [Conventional Commits](https://www.conventionalcommits.org/): `feat` bumps the
  minor version, `fix` and `perf` bump the patch version, a `BREAKING CHANGE:`
  footer bumps the major version, and every other type releases nothing.
- The default branch is `main`. Changes land through a pull request that is
  squash merged by a repository owner.
- Repositories not listed in the tables above are integrations, experiments or
  infrastructure, and are not part of a product line.
