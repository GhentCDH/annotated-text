import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";

const text1 = `1.The quick brown fox jumps over the lazy dog.\n2.Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
const text = `1.Φλαυίῳ Ἀβινναίῳ ἐπάρχῳ εἴλης στρατι-2.ωτῶν κάστρων Διο[ν]υσιάδος παρὰ Φλα[ο]υίου3.Αὐνῆ οὐετρανοῦ τῶν ἐντιμους(*)ἀπολλυμένων(*)4.γεουχοῦντι(*) ἐν κώμῃ Ἑρμοῦ πόλι(*). πρὸ δʼ ὀλίγων(*)5.ἡμερῶν τούτων οὐκ ὖδα(*) τίνι λόγου(*) καὶ λῃστρι-6.κῷ τρόπῳ νυκτὸς χρησάμενοί τινες κακοῦ-7.ργοι ἐπῆλθαν οἰκίᾳ μου καὶ ἤ(*) τι εἶχον ἐν8.τῇ αὐτῇ οἰκίᾳ βαστάξαντες καὶ μέχρι δεῦρου(*)9.μηδὲν εὑρηκέναι με ἀπὸ τῶν συληθέν-10.των. διὰ αὐτὸ τοῦτο ἀξιῶ καὶ δέομαί σου τῆς11.φιλανθρωπίας τω(*) εἰρήναρχον καὶ τοὺς12.δημοσίους τῆς αὐτῆς κώμης Ἑρμοῦ πόλε-13.ως <συλλαβόμενος>{καὶ}καταναγκάσῃς αὐτοὺς τοὺς κακουρ-14.γοις(*)συ(*) παραστῆσαι, εἶτα <τὰ> γραφέντα ὑπὲ(*)15.ἐμοῦ εἰς γνῶσιν τοῦ κυρίου μου δουκὸς16.ἀνανικῃς(*), αὐτοῦ γάρ ἐστιν <τοὺς>τὰ τοιαῦτα τολ-17.μοῦντες(*)ἐκδικῖν(*). καὶ τούτο(*) τυχὼν χάρι-18.τά σοι ὁμολογήσω, κύριε. διευτύχει.19.(hand 2)  Φλαύι(*)ος Αὐνῆς ἐπιδέδοκα(*)20.ὑπ[ατ]ε̣ίας τῶν δεσποτῶν ἡμῶν Κ[ωστ]αντίνου(*)21.τ̣[ὸ]δ καὶ Κώσταντος(*) τὸ γἈγούσ[των](*)22.Παχὼν ϛ. `;

const annotations1 = [{ start: 12, end: 27, id: "fox-1" }];

const annotations = [{ start: 2, end: 8, id: "play-1" }];
const textOffset = 1;
export const setupPlayground = (id: string) => {
  clearAnnotatedTextCache();
  const firstAnnotation = annotations[0]!;

  const firstAnnotationOnly = document.createElement("div");
  firstAnnotationOnly.id = `${id}_${firstAnnotation.id}`;
  firstAnnotationOnly.innerHTML = "first Annotation Only";

  const fullText = document.createElement("div");
  fullText.id = `${id}_fulltext`;
  fullText.innerHTML = "Full Text with All Annotations";

  const mainElement = document.getElementById(id);

  mainElement.appendChild(firstAnnotationOnly);
  mainElement.appendChild(fullText);

  createAnnotatedText(firstAnnotationOnly.id, {
    text: TextLineAdapter({
      textOffset,
    }),
  })
    .setText(text)
    .setAnnotations([firstAnnotation])
    .changeTextAdapterConfig("limit", {
      start: firstAnnotation.start,
      end: firstAnnotation.end,
    });

  // createAnnotatedText(fullText.id, {
  //   text: TextLineAdapter({
  //     textOffset,
  //   }),
  // })
  //   .setText(text)
  //   .setAnnotations(annotations);
};
