# Swipr
Swipe through horizontal content.

## Demo
* https://robinpoort.github.io/swipr/ (still need to style this)

## Features:
- Returns false if both mobile and touch are detected where you can simply swipe naturally
- Adds buttons when mobile or touch is not detected for navigating on those devices
- Hides buttons when scrollbar is gone
- Disables button when there's no more scrolling to do

## Use

### Markup

```html
<div class="wrapper" data-swipr-wrapper>
    <div class="items items1" data-swipr>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>
</div>
```

### Initialize
```js
var swiper = new swipr({
    swiper: '[data-swipr]'
});
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| wrapper | The swipr wrapper. hide overflow and hold buttons in place. | `'[data-swipr-wrapper]'` |
| swiper | Swipr container. Has overflow. | `'[data-swipr]'` |
| startItem | Scroll to this item on load | `'[data-swipr-start]'` |
| swiprPreviousButtonClass | Left button class | `'swipr-prev'` |
| swiprPreviousButtonContent | Left button content | 'previous' |
| swiprNextButtonClass | Right button class | `'swipr-next'` |
| swiprNextButtonContent | Right button content | 'next' |
| disabledButtonClass | Class for disabled buttons | `'is-disabled'` |
| amount | Amount of visible width to scroll | 0.8 |
| speed | Scroll speed | 400 |
| initiatedClass | Class added when swipr is initiated | `'is-initiated'` |
| enabledClass | Class added when at least one button is active | `'is-enabled'` |
| disableOnMobileTouch | Disable plugin when mobile and touch are detected | true |