<template>

<h4>Vue component annotated text</h4>

<menu>
  <input type="radio" value="nested" id="nested" v-model="props.render"><label for="nested">Nested</label> 
<input type="radio" value="flat"  id="flat" v-model="props.render"><label for="flat">Flat</label> | 
<input v-model="props.debug"      type="checkbox"><label>Debug messages</label> | 
<input v-model="props.showLabels" type="checkbox"><label>Show labels</label>
</menu>

<hr>

<AnnotatedText
    text="012345678901234567890123456789"
    :annotations="annotations"
    :lines="textLines"
    :debug="props.debug"
    :show-labels="props.showLabels"
    :render="props.render"
    @click-annotation="onClick"
    @_mousemove="onMouseOver"
  />
</template>

<script setup lang="ts">
import {
  AnnotatedText,
  AnnotatedTextProps,
  Annotation,
  AnnotationTarget,
  Line,
  Paragraph,
} from "./";

import { reactive } from "vue-demi";
import { RenderType } from "./types/AnnotatedText";

const paragraphs = [
  {
    start: 0,
    end: 10,
    lines: [],
  },
] satisfies Paragraph[];

const annotations = [
  {
    start: 5,
    end: 9,
    class: "annotation annotation--color-1",
    target: "span",
    metadata: {id: 1},
    label: "typo",
  },
  {
    start: 23,
    end: 36,
    class: "annotation annotation--color-3",
    target: "span",
    metadata: {id: 2},
    label: "syntax",
  },
  {
    start: 3,
    end: 6,
    class: "annotation annotation--color-2",
    target: "span",
    metadata: {id: 3},
    label: "unit",
  },
  {
    start: 3,
    end: 17,
    class: "annotation annotation--color-1",
    target: "gutter",
    metadata: {id: 5},
    label: "lang",
  },
  {
    start: 15,
    end: 37,
    class: "annotation annotation--color-2",
    target: "gutter",
    metadata: {id: 6},
    label: "unit",
  },
] satisfies Annotation[];

// const text = "1.Χ[αι]ρήμ[ων] Ἀπολλωνίωι τῶι\n2.[φι]λτάτωι χαίρειν.\n3.καὶ διʼ ἑτ[έρας ἐπι]στολῆς ἔγραψά σοι, ἵνα δύο \n4.ἀρτάβαι σει[ταρίου](*)ἰδισθῶσί(*) μοι, ἐπεὶ λείαν(*) ἐκο-\n5.λάσθημεν [  ̣  ̣  ̣  ̣  ̣] ἄδελφε μου, Ἰσίδωρον ἔπεμ-\n6.ψα τούτου εἵνε[κα](*), [ἵ]να μ[ο]ι εὐθέως πεμφθῶσι\n7.καὶ κρειθὴ(*)[  ̣  ̣  ̣]ειδ[  ̣  ̣]ου Σαραπᾶς εἰς λόγον\n8.ναύλου [  ̣  ̣  ̣  ̣  ̣  ̣] οἴνου (δραχμὰς)δ(τετρώβολον). ἐὰν μὲν οὖν\n9.δῶι τὸ [  ̣  ̣  ̣  ̣  ̣]αδ[  ̣  ̣]ν, ἄριστα· ἐὰν δὲ μὴ λαβὼν\n10.παρα[  ̣  ̣  ̣  ̣][ χ]αλκὸν ναυλῶσαι ὀνάριον καὶ\n11.εὐθ[έως ][  ̣  ̣  ̣  ̣][ κο]μισθήτω· μόλις γὰρ ἡμερῶν\n12.δύο [  ̣  ̣  ̣  ̣  ̣  ̣]ομεν· γράφω οὖν σοι, ἵνα εἰδῇς\n13.τὴ[ν ][  ̣  ̣  ̣  ̣  ̣][ θε]ῶν δὲ βουλομένων καὶ αὐτὸς\n14.ἐλ̣[πίζω(?)](*)[Παῦ]νι κε κατελθεῖν. λέγεται γὰρ τὸν ἄνθρω-\n15.πο[ν ][  ̣  ̣  ̣  ̣][ εἰ]ς Ἀλεξ[άν]δρει[α]ν τοῦ πορεύεσθαι χάριν\n16.δ[- ca.9 -]ια  ̣  ̣νω[  ̣  ̣  ̣  ̣] π[α]ρὰ θεοῖς πᾶσι\n17.δια[  ̣  ̣  ̣  ̣  ̣]λωι μετὰ τῶν ἐμῶν δράσειν\n18.περ  ̣[  ̣  ̣  ̣  ̣  ̣  ̣]ησωι ἐπὶ σὲ προσεπιπαρακαλέσωι(*)\n19.περὶ τῶ[ν ][  ̣]  ̣[  ̣]μένων αἰσθόμενός σου τὴν εἴς με\n20.φιλοφ[ροσ]ύ[νην]. φρόντισον δʼ ἐμοῦ χορίου δερμάτ(ων)\n21.ἑξακοσίων  καὶ σφράγεισον(*) τὸ σειτάριον(*) καὶ τὴν\n22.κρειθὴν(*)δ[ηλώ]σας(*) μοι, π[ο]ίωι μέτρωι ἔπεμψας.\n23.ἀσπάζου   ̣  ̣[  ̣]  ̣  ̣  ̣ πάντ[α] σου παιδία, μεθʼ ὧν ἔ̣[σ]ῃ̣\n24.[ἔ]ρρω(σο). Φαρμο(ῦθι)κβ.\n25.πέμψον δὲ ἡμεῖν(*) κινάρας. "
const text = "0.23456  9\n1.34567890123456789\n1.3   789";

const textToLines = (text: string): Line[] => {
  const regLineNumber = /^([0-9\/]+[a-z]?)\./g;
  let lineStart = 0;
  let lineEnd = 0;
  let gutter = "";

  // split text into lines
  let lines = text.split("\n");
  let lineObjects = [] satisfies Line[];

  // split lines into line number, text, start and end
  for (let i = 0; i < lines.length; i++) {
    lineEnd = lineStart + (lines[i].length - 1);
    gutter = lines[i].match(regLineNumber)
      ? lines[i].match(regLineNumber)[0]
      : "";
    lineObjects[i] = {
      gutter: gutter,
      text: lines[i].replace(regLineNumber, ""),
      start: lineStart + gutter.length,
      end: lineEnd,
    };
    lineStart = lineEnd + 2;
  }
  return lineObjects;
};


const textLines = textToLines(text);

const props = reactive({ showLabels: false, debug: false, render: 'nested' as RenderType });

const onClick = function(annotation: Annotation): void {
  console.log('** click received **')
  console.log(annotation)
  if ( annotation.class.includes('annotation--active') ) {
    annotation.class = annotation.class.replace('annotation--active', '').trim();
  } else {
    annotation.class = annotation.class += " annotation--active";
  }
}

const onMouseOver = function(event): void {
  console.log(caretPositionFromPoint(event.clientX, event.clientY))
}

function caretPositionFromPoint(x: number, y: number): {
  offsetNode: Node;
  offset: number;
  getClientRect(): ClientRect | DOMRect;
} | null {
  // @ts-ignore
  if (document.caretPositionFromPoint) {
    // @ts-ignore
    let position = document.caretPositionFromPoint(x, y);
    return position ? {
      offsetNode: position.offsetNode,
      offset: position.offset,
      getClientRect() {
        return position.getClientRect();
      }
    } : null;
  } else {
    let range = document.caretRangeFromPoint(x, y);
    return range ? {
      offsetNode: range.startContainer,
      offset: range.startOffset,
      getClientRect() {
        return range.getClientRects()[0];
      }
    } : null;
  }
}

// console.log(textLines);
</script>
<style>

body{
  font-family: sans-serif;
}
hr{
  border: 1px solid gray;
  margin-bottom: 1em;
}

</style>