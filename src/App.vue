<template>
  <AnnotatedText
    text="012345678901234567890123456789"
    :annotations="annotations"
    :lines="textLines"
    :debug="true"
    :show-labels="false"
    render="flat"
    @click-annotation="onClick"
  />
</template>

<script setup lang="ts">
import {
  AnnotatedText,
  Annotation,
  AnnotationTarget,
  Line,
  Paragraph,
} from "./VueComponentAnnotatedText";

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
    target: "span",
    metadata: {id: 4},
    label: "lang",
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

const onClick = function(annotation): void {
  console.log('** click received **')
  console.log(annotation)
}

// console.log(textLines);
</script>
