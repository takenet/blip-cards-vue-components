<template>
  <div :class="'container collection'">
    <div :class="'slideshow-container bubble ' + position">
        <div style="float: left" v-for="item in document.items">
          <document-select class="slide-item" :position="position" :on-selected="onSelected" :document="item" />
        </div>
        <div style="clear: both"></div>
        <a class="prev" ng-if="showPrev" @click="plusSlides(-1)">&#10094;</a>
        <a class="next" @click="plusSlides(1)">&#10095;</a>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

export default {
  props: {
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    slideIndex: {
      type: Number,
      default: 1
    },
    onSelected: {
      type: Function
    }
  },
  created: function () {
    this.showSlides(1)
  },
  methods: {
    plusSlides: function (n) {
      this.showSlides(this.slideIndex += n)
    },
    showSlides: function (n) {
      let i
      let slides = document.getElementsByClassName('slide-item')
      if (n > slides.length) {
        this.slideIndex = 1
      }

      if (n < 1) {
        this.slideIndex = slides.length
      }

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none'
      }

      slides[this.slideIndex - 1].style.display = 'block'

      if (this.slideIndex === 1) {
        this.showPrev = false
      }
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

   .collection {
    .slideshow-container {
      width: 90%;
      position: relative;
      margin: auto;

      a {
        text-decoration: none;
      }
    }

    .slide-item {
        // display: none;
    }

    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: $vue-light-blip;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 5px 0 0 5px;
      box-shadow: -8px 3px 12px 0 #D3D3D3;
      background-color: #FFFFFF;
    }

    /* Position the "next button" to the right */
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }

    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }
  }

</style>
