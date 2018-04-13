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
