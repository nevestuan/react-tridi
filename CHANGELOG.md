
# Change Log

## [2.1.0] - 2021-04-30
### Added
- Added event onLoadChange

## [2.0.0] - 2021-03-23
### Added
- Zoom function: zoom in, zoom out the image
- Move function: move the image in zoom mode

### Fixed
- Some bugs related to wrong pin's position

## [1.2.2] - 2021-02-26
### Fixed
- Remove console logs

## [1.2.1] - 2021-02-26
 
### Added
- Add a customizable render hint prop
 
### Fixed
- Fix bug of cannot touch on pins & control bar on mobile
- Fix bug of badly rendering hint message
 
## [1.2.0] - 2021-02-24
 
- Fix Bugs of the pin item
- Add some new features
 
### Added
- Add status bar to show current frame and recording state.
- Support Next/Back by arrow keypress
 
### Changed
- Lift state of pins to outside of the component, so it will be easier to interact with pin's data. We will need to manage pin's state, and pass in the setState function as props.
- Update pin data structure: add recordingSessionId. Each recording session will have a unique id. The id will be returned on session ended.
 
### Fixed
- Fix some bugs of control bar