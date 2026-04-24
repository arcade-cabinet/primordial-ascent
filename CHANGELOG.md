# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/arcade-cabinet/primordial-ascent/compare/v0.2.0...v0.3.0) (2026-04-24)


### Features

* production polish and cavern signature system ([#14](https://github.com/arcade-cabinet/primordial-ascent/issues/14)) ([383c10e](https://github.com/arcade-cabinet/primordial-ascent/commit/383c10e04a937f1ea99c0ac816c844ffeb15352b))


### Documentation

* finalize state and test fixes ([#16](https://github.com/arcade-cabinet/primordial-ascent/issues/16)) ([8e2ac02](https://github.com/arcade-cabinet/primordial-ascent/commit/8e2ac02f78628d65180c7cfa0e125bf877815267))

## [0.2.0](https://github.com/arcade-cabinet/primordial-ascent/compare/v0.1.0...v0.2.0) (2026-04-24)


### Features

* extract primordial-ascent from jbcom/arcade-cabinet ([dd811f9](https://github.com/arcade-cabinet/primordial-ascent/commit/dd811f9cf88acc70f4e8f25e78b8c6d187c1e22a))


### Bug Fixes

* **pa:** don't mount RigidBody + TrimeshCollider for empty chunks ([#9](https://github.com/arcade-cabinet/primordial-ascent/issues/9)) ([cba524b](https://github.com/arcade-cabinet/primordial-ascent/commit/cba524b10c9e982083f29596b76790d22e17474b))
* **pa:** hook-order violations + seal remaining perf leaks ([#12](https://github.com/arcade-cabinet/primordial-ascent/issues/12)) ([fd5b339](https://github.com/arcade-cabinet/primordial-ascent/commit/fd5b339f20202c93adec281691cf15a6c4528bfa))


### Performance

* **pa:** dispose chunk geometries, drop zombie worker messages, throttle player raycast ([#10](https://github.com/arcade-cabinet/primordial-ascent/issues/10)) ([937d375](https://github.com/arcade-cabinet/primordial-ascent/commit/937d375922d7fea4cf6e542ce010c21df12cd7b7))
* **pa:** lazy-load gameplay so landing ships ~75KB gzip ([#13](https://github.com/arcade-cabinet/primordial-ascent/issues/13)) ([aa84387](https://github.com/arcade-cabinet/primordial-ascent/commit/aa843876007dd621ab9c5e57bd18852695d04a63))


### Documentation

* **agentic:** handoff + decisions log for primordial-ascent ([#11](https://github.com/arcade-cabinet/primordial-ascent/issues/11)) ([2736a27](https://github.com/arcade-cabinet/primordial-ascent/commit/2736a271bbaaafc105a61dc287a966f23926c553))

## [Unreleased]
