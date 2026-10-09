// Design Token Swapper (gra.UI.ty)
// Links raw colors and text formatting in the selection to the published
// gra.UI.ty library (Figma file "gra.UI.ty Design System",
// 6x8FIzl2KL7owqwQWt9Xbc). Layers are bound to the library's own variables
// and text styles, imported by key — never to local copies — so updating the
// library updates every file that uses it.
//
// DESIGN_SYSTEM_COLOR_TOKENS and DESIGN_SYSTEM_TEXT_STYLES are exported from
// that file (Color Tokens collection, current 4-part names only; the 31
// gra.UI.ty text styles). Re-export them when tokens are added or renamed.
//
// Colors: a fill/stroke already bound to one of these library variables is
// correctly mapped and skipped. Otherwise (raw, or — with "fix legacy" on —
// bound to an old token like bg/primary, a local copy, or a legacy style) its
// color is matched against each token's LIGHT value within the layer's
// category: TEXT fills -> text/*, strokes -> border/*, other fills -> bg/*,
// icon-shaped layers fall back to bg/*.
//
// Default vs invert: neutral tokens have an invert twin (bg uses
// "invert primary", text/border use "invert-primary"). Invert mode off:
// invert tokens are never offered. On: a token with a twin is replaced by
// the twin. Tokens without one (brand, status, white, static, alpha) are
// offered in both.
//
// Text: a TEXT layer already using one of these library text styles is
// skipped. Otherwise its font, weight, size, line height, letter spacing and
// case must all match a style exactly before that style is applied.
//
// Ties go through component-name and sibling-instance tie-breaks; anything
// still ambiguous or unmatched is left for manual review, never guessed.
//
// Spacing and corner radius: auto-layout gap / row gap / padding and each
// corner's radius are matched exactly to the library's spacing/sp-* and
// corner-radius/cr-* tokens (values are unique, so no ties). Sides or corners
// sharing a value become one row. An untouched 0 is ignored, and a radius
// that already makes the layer fully round maps to the pill token.

const PANEL_WIDTH = 504;

figma.showUI(__html__, { width: PANEL_WIDTH, height: 640 });
figma.root.setRelaunchData({ open: "" });

const MAX_NODES = 20000;
const MAX_SIBLINGS_CHECKED = 40;
const LIBRARY_LABEL = "gra.UI.ty";

const DESIGN_SYSTEM_COLOR_TOKENS = [
  // ---- bg ----
  { name: "bg/emphasis/brand/default", light: "#0673F9", dark: "#0673F9", key: "640a734ad253d9f02f30f678390966dfcc7b455e" },
  { name: "bg/emphasis/brand/disabled", light: "#61A8FF", dark: "#003270", key: "9091641ce1d76972260baa20adb2f63519381b76" },
  { name: "bg/emphasis/brand/hover", light: "#2989FF", dark: "#2989FF", key: "28349510daf604b62a1802e0591216f94e7007e2" },
  { name: "bg/emphasis/error/default", light: "#D22D3A", dark: "#D22D3A", key: "41c42dcc6ab4a4f7103d2019e991e4f54a4bfd4e" },
  { name: "bg/emphasis/error/disabled", light: "#F8636B", dark: "#63080D", key: "40a2d1d6f7e2f1143b5e7ad684f4aff6e3e38654" },
  { name: "bg/emphasis/error/hover", light: "#EE3F44", dark: "#EE3F44", key: "a37edcc0d6f09b29d0fd95626d8995b3536b7b0a" },
  { name: "bg/emphasis/purple/default", light: "#6138D3", dark: "#6138D3", key: "3c6ba5c543f11ac112f02347216a7d74c7fa4bb9" },
  { name: "bg/emphasis/purple/disabled", light: "#B49DFE", dark: "#331D72", key: "58ea5a3bfdaaf9f1a4941864116bcac7076c85c1" },
  { name: "bg/emphasis/purple/hover", light: "#7B55EE", dark: "#7B55EE", key: "5c9f998496b1d7b8d7d8b9672f7edd2f30cfe059" },
  { name: "bg/emphasis/static-black/default", light: "#0B0C0E", dark: "#0B0C0E", key: "81f7bb4334c41428af8ebeb958948d050c508a11" },
  { name: "bg/emphasis/static-black/disabled", light: "#8C95A6", dark: "#B2B9C7", key: "06a2ad4c6f6645672a4e84185330688bb5fbc10b" },
  { name: "bg/emphasis/static-black/hover", light: "#16191D", dark: "#16191D", key: "31b42a95530e9869f083358bc79d9dc8465f6098" },
  { name: "bg/emphasis/static-white/default", light: "#FFFFFF", dark: "#FFFFFF", key: "264755f4afd87fca0976b937e3feb403223ef09f" },
  { name: "bg/emphasis/static-white/disabled", light: "#E1E5EA", dark: "#EDEFF3", key: "7cd7e1b4a61d5633a84604c02c9f751ccedea6d0" },
  { name: "bg/emphasis/static-white/hover", light: "#F6F7F9", dark: "#F6F7F9", key: "ab71d7d5a2d1994b3012457609cf07b4760e5420" },
  { name: "bg/emphasis/success/default", light: "#009965", dark: "#009965", key: "cd68f016d8cb3b565964c3058dd1c84b17fe3f2d" },
  { name: "bg/emphasis/success/disabled", light: "#50CE99", dark: "#003D29", key: "d2775536a844463ba05abf427226abdba12a34ef" },
  { name: "bg/emphasis/success/hover", light: "#13B97C", dark: "#13B97C", key: "095e03a313949634fd1c0787aeb53e8f3b5bccee" },
  { name: "bg/emphasis/warning/default", light: "#F37216", dark: "#F37216", key: "759100c878a589a79263e26f7ee8666ede30dcc2" },
  { name: "bg/emphasis/warning/disabled", light: "#FD9254", dark: "#5C1F00", key: "443489e74070c91e793333a904278aa2f657eb94" },
  { name: "bg/emphasis/warning/hover", light: "#FD9254", dark: "#FD9254", key: "1f6a57faf39d2beb3da667fca89e2503b64a45ac" },
  { name: "bg/emphasis/yellow/default", light: "#F59700", dark: "#F59700", key: "cbde57d0aa8aa6de83716681bd2f88fdc5507b8b" },
  { name: "bg/emphasis/yellow/disabled", light: "#FEC553", dark: "#5C2900", key: "d0e879f1a5a59f7e8e53b581cd2fe3fa8110f909" },
  { name: "bg/emphasis/yellow/hover", light: "#FEB000", dark: "#FEB000", key: "fd4a643049861d57626d366be9d84f026be73824" },
  { name: "bg/subtle/alpha/default", light: "#FFFFFF1F", dark: "#FFFFFF1F", key: "7f5dfcba60fca3085f72890d1e3d5bb8cbc45e72" },
  { name: "bg/subtle/alpha/hover", light: "#FFFFFF33", dark: "#FFFFFF33", key: "3120195eafa638a91878f95c140186e304307582" },
  { name: "bg/subtle/alpha/overlay", light: "#16191DCC", dark: "#16191DCC", key: "1b67a6da9ead85ef500470021dd9c1e1b3907a66" },
  { name: "bg/subtle/brand/default", light: "#E5F1FF", dark: "#002452", key: "f9f2d275ef68c117162f20011cba822ce61de538" },
  { name: "bg/subtle/error/default", light: "#FFE5E7", dark: "#4A040A", key: "b8494fc06899e1220ba94ffa83ab3a327b37a9ce" },
  { name: "bg/subtle/invert primary/default", light: "#0B0C0E", dark: "#FFFFFF", key: "7caae3f219367e598fb51017d13072d3f1ac925b" },
  { name: "bg/subtle/invert primary/disabled", light: "#8C95A6", dark: "#30363D", key: "25a7693a5f959111121efdac973575a5f5352503" },
  { name: "bg/subtle/invert primary/hover", light: "#16191D", dark: "#F6F7F9", key: "3df21c413c969192d0f29e9fea84954938150035" },
  { name: "bg/subtle/invert secondary/default", light: "#16191D", dark: "#F6F7F9", key: "a152c10a1e8f005d9eec0d64338025c560e8db3f" },
  { name: "bg/subtle/invert tertiary/default", light: "#23282F", dark: "#EDEFF3", key: "c3a1b19526cf08cbacbe3f7b821610ea91453f91" },
  { name: "bg/subtle/primary/default", light: "#FFFFFF", dark: "#0B0C0E", key: "fe1c730243ccd85a749b8ecd097498c52f1126b6" },
  { name: "bg/subtle/primary/disabled", light: "#E1E5EA", dark: "#23282F", key: "fca5622a41fe0ae5dbabb36852f85b57726bb77d" },
  { name: "bg/subtle/primary/hover", light: "#F6F7F9", dark: "#16191D", key: "e8553f06acd7d92d1f4abb3404121cef2ecc0473" },
  { name: "bg/subtle/purple/default", light: "#F5E5FF", dark: "#331D72", key: "c54769f7c71beef3d05c046dab1cd03769c1648f" },
  { name: "bg/subtle/secondary/default", light: "#F6F7F9", dark: "#16191D", key: "938d8e1e43acc9a370ed95919e9b216d7bd92784" },
  { name: "bg/subtle/success/default", light: "#D9FCED", dark: "#003D29", key: "7a902942199e3378e0cdae02ba5c8a40cb68934c" },
  { name: "bg/subtle/tertiary/default", light: "#EDEFF3", dark: "#23282F", key: "c832e0931ad45fa496066701f7f93c7eb21d2184" },
  { name: "bg/subtle/warning/default", light: "#FFF1E5", dark: "#441704", key: "a197c19234358030c809883d5b518f8780628698" },
  { name: "bg/subtle/yellow/default", light: "#FFF3D6", dark: "#3D1A00", key: "a827b92c41cda7bc8ed7db23b0b61ee0c9fe6fbe" },
  // ---- border ----
  { name: "border/emphasis/brand/default", light: "#0673F9", dark: "#61A8FF", key: "6103c3f5044b364cad279610b69258fbb702afc5" },
  { name: "border/emphasis/error/default", light: "#D22D3A", dark: "#F8636B", key: "cdaba32741daee5fea59d163ca596fcd2aa2382d" },
  { name: "border/emphasis/invert-primary/default", light: "#16191D", dark: "#FFFFFF", key: "31ce23cca62625e87135b03991b9079324a97de8" },
  { name: "border/emphasis/primary/default", light: "#FFFFFF", dark: "#16191D", key: "fcf4846a69803c79ea61e76ffbc87b4b3bedd3dc" },
  { name: "border/emphasis/purple/default", light: "#6138D3", dark: "#B49DFE", key: "25d024868c066b3c48bf5ff5d3984366b0e33e4b" },
  { name: "border/emphasis/success/default", light: "#009965", dark: "#009965", key: "6bb996daf6cd6a7a1272bb79c0c024fc4698781c" },
  { name: "border/emphasis/warning/default", light: "#DE5A02", dark: "#FD9254", key: "84e4aa3cc9bb46d2e4b45f076ceba1a3885a5687" },
  { name: "border/emphasis/yellow/default", light: "#D17300", dark: "#FEC553", key: "b347cb7fb5024d612086690b5f0d9c5ae566c4a4" },
  { name: "border/moderate/brand/default", light: "#2989FF", dark: "#003270", key: "72d13d5cce6c7de77ff9bd4a33c608ee795d0ec6" },
  { name: "border/moderate/error/default", light: "#F8636B", dark: "#63080D", key: "7b8758ccce38e8599a084260e62e2707696b7f2f" },
  { name: "border/moderate/invert-primary/default", light: "#30363D", dark: "#E1E5EA", key: "5d7b16439b1cffb013cee720acbadf16ff6ae9e9" },
  { name: "border/moderate/primary/default", light: "#C9CFD9", dark: "#30363D", key: "8264e64a3a85462ffd406a1e657c1db4fb2e2372" },
  { name: "border/moderate/purple/default", light: "#967CFD", dark: "#46279B", key: "fe3ee4881fd85e0bd1fc07ab4294125a1d6a5fae" },
  { name: "border/moderate/success/default", light: "#50CE99", dark: "#005C3D", key: "b5cd0a0a3079afbb3ac1f7255d3b376f0af5baf8" },
  { name: "border/moderate/warning/default", light: "#FD9254", dark: "#802D00", key: "578340323719af5e2275648124a43466c89536cd" },
  { name: "border/moderate/yellow/default", light: "#FEB000", dark: "#5C2900", key: "4a012c0a67d0c7d342af272892e6f5be2517ee46" },
  { name: "border/subtle/brand/default", light: "#61A8FF", dark: "#003270", key: "19793cdf682e0f818eda8aa358e9e31f03076b68" },
  { name: "border/subtle/brand/disabled", light: "#C2DDFF", dark: "#002452", key: "ca9f28d599b0932cbe31fa19e2ebadacdbedd70a" },
  { name: "border/subtle/error/default", light: "#FBBBBF", dark: "#63080D", key: "d58060fa0e1fbf1b2725ab91d4c8ecb1fcd6c9a5" },
  { name: "border/subtle/error/disabled", light: "#FBBBBF", dark: "#4A040A", key: "502bbd882fca51e8372ea838eb4b7b9e8575c7a6" },
  { name: "border/subtle/invert-primary/default", light: "#30363D", dark: "#E1E5EA", key: "d89549f57a02dd772e25363ecbac6b0f6ba93aa6" },
  { name: "border/subtle/invert-primary/disabled", light: "#23282F", dark: "#EDEFF3", key: "5891323c6f1138bb7c7240d0a3b8ce9811939f92" },
  { name: "border/subtle/primary/default", light: "#E1E5EA", dark: "#30363D", key: "07d79e2d5bae0984e32b1f7f31eea5b463029e7a" },
  { name: "border/subtle/primary/disabled", light: "#EDEFF3", dark: "#23282F", key: "ce8f71a4a7bfb387d89de72fe00c47d68196cc76" },
  { name: "border/subtle/purple/default", light: "#CEBCFE", dark: "#46279B", key: "f59d25cf836b5aa39a04396207f3d6c7cf04e59d" },
  { name: "border/subtle/purple/disabled", light: "#E1D1FF", dark: "#221056", key: "4861444be296d9bc8dd9dfc487afbc07dc5cc91e" },
  { name: "border/subtle/static-black/default", light: "#30363D", dark: "#30363D", key: "d080ce2d1e97c96b5ce977188db61be5c3caf695" },
  { name: "border/subtle/static-black/disabled", light: "#23282F", dark: "#23282F", key: "de42d152d8d71f517c5f22520c53185541e2fc8d" },
  { name: "border/subtle/static-white/default", light: "#E1E5EA", dark: "#E1E5EA", key: "1d00448c584ea7cfc34adaf27131aa81139ec44d" },
  { name: "border/subtle/static-white/disabled", light: "#EDEFF3", dark: "#EDEFF3", key: "51307d7282420dcd12107aa57553d37a2394acba" },
  { name: "border/subtle/success/default", light: "#ACF7D3", dark: "#005C3D", key: "b5483da8ec92170e10f0a9ff74b217b0d38ba37c" },
  { name: "border/subtle/success/disabled", light: "#ACF7D3", dark: "#002D1E", key: "dfa514b72b6bc5f41aebc78264d56623c13eedd7" },
  { name: "border/subtle/warning/default", light: "#FFD2BA", dark: "#802D00", key: "9235c153169a749af7e33bd5b8c223c118c39486" },
  { name: "border/subtle/warning/disabled", light: "#FFD2BA", dark: "#441704", key: "ddf77d56afa13ee45aaad051edf14649dce14839" },
  { name: "border/subtle/yellow/default", light: "#FFD580", dark: "#5C2900", key: "e9ad09c6416e05cd1c35b1601448fbaa7041ae9b" },
  { name: "border/subtle/yellow/disabled", light: "#FFE4AD", dark: "#3D1A00", key: "da2ab4802a9a634ee6206fd98fee07c5eee4fe30" },
  // ---- text ----
  { name: "text/emphasis/brand/default", light: "#0673F9", dark: "#61A8FF", key: "e58b758972d2654f65d22bca43761696f3d28cc0" },
  { name: "text/emphasis/brand/disabled", light: "#94C4FF", dark: "#004599", key: "7d98439d76a2addd2a9aa16efec7c2a03eadcb71" },
  { name: "text/emphasis/error/default", light: "#D22D3A", dark: "#F8636B", key: "36fedadd7a7aba2d7c1b8c03b09fa950c04466ef" },
  { name: "text/emphasis/error/disabled", light: "#FA9499", dark: "#7E1219", key: "dcd7d3995ec381349b80efbed513f61dd75827e6" },
  { name: "text/emphasis/invert-primary/default", light: "#FFFFFF", dark: "#16191D", key: "5c9743b463b54670ef464b759601237655887366" },
  { name: "text/emphasis/invert-primary/disabled", light: "#B2B9C7", dark: "#5B6271", key: "ddc7d88a01fe798a9bd7c2e812c7005786893eed" },
  { name: "text/emphasis/primary/default", light: "#16191D", dark: "#FFFFFF", key: "4c2e149c8125f956d82021a3559722723a40932a" },
  { name: "text/emphasis/primary/disabled", light: "#8C95A6", dark: "#5B6271", key: "497d21bd9f553587cc92b551a96105560ca1df37" },
  { name: "text/emphasis/purple/default", light: "#6138D3", dark: "#B49DFE", key: "f4d66a84d1ca1544a1c71c07192d62453dc6f0fa" },
  { name: "text/emphasis/purple/disabled", light: "#CEBCFE", dark: "#46279B", key: "8e0f034aac513a3c84e4db8670c468fe0d4f67d1" },
  { name: "text/emphasis/secondary/default", light: "#5B6271", dark: "#B2B9C7", key: "dc2da52982236492980ab147b2f8e2fab6af5d54" },
  { name: "text/emphasis/secondary/disabled", light: "#C9CFD9", dark: "#23282F", key: "55e2280c409f642786e61103e0be7fde280e706c" },
  { name: "text/emphasis/static-black/default", light: "#16191D", dark: "#16191D", key: "f2b7fc78fa6165bd1770a3147fc815e127b5c03a" },
  { name: "text/emphasis/static-black/disabled", light: "#B2B9C7", dark: "#5B6271", key: "e2b1b09e3ad88ac7bdfd91eb027ddd64811b98c5" },
  { name: "text/emphasis/static-white/default", light: "#FFFFFF", dark: "#FFFFFF", key: "30c6f4adee932ced5b5ddb7e521fd88dd1ae92d9" },
  { name: "text/emphasis/static-white/disabled", light: "#F6F7F9", dark: "#F6F7F9", key: "16ac7f97db1096fed4f47ca10b3ab5b50a925f5a" },
  { name: "text/emphasis/success/default", light: "#007A51", dark: "#50CE99", key: "3d1faf9bd25b6b1ec051105451626811d12fe907" },
  { name: "text/emphasis/success/disabled", light: "#7EE7B8", dark: "#005C3D", key: "edfb11793e56537b355ed7919035781d0192a724" },
  { name: "text/emphasis/warning/default", light: "#DE5A02", dark: "#FD9254", key: "4a4af36661b9be9746f8c88137c23a3957598187" },
  { name: "text/emphasis/warning/disabled", light: "#FFB286", dark: "#802D00", key: "2586e08462a45a20ffe5e77c62e3b09dc4a19537" },
  { name: "text/emphasis/white/default", light: "#FFFFFF", dark: "#FFFFFF", key: "a2666460a96cd2a2587e5d49c2498afb55b87e8e" },
  { name: "text/emphasis/white/disabled", light: "#F6F7F9", dark: "#5B6271", key: "b443cfeef48c8bdd9781d3ea1be0217998628ef9" },
  { name: "text/emphasis/yellow/default", light: "#D17300", dark: "#FEC553", key: "6118eb5083193dcb9a55ad395e1163ac8dca03c2" },
  { name: "text/emphasis/yellow/disabled", light: "#FFD580", dark: "#944500", key: "ab6c73b7c9039fe7a97fff9723ea7f8a7a294797" },
  { name: "text/subtle/alpha/default", light: "#FFFFFF1F", dark: "#FFFFFF1F", key: "5b4a73d0cfbd996b8cf3602a0e407ded6bc1f0ea" },
  { name: "text/subtle/alpha/hover", light: "#FFFFFF33", dark: "#FFFFFF33", key: "4648b553de7db254173a53d9244ef955e8d2b07f" },
  { name: "text/subtle/alpha/overlay", light: "#16191DCC", dark: "#16191DCC", key: "26f0a22faf51cce6a1784a29127f54f922f5b3e9" },
];

const DESIGN_SYSTEM_TEXT_STYLES = [
  { name: "display-bd-d1", family: "Mona Sans", style: "SemiBold", size: 76, lineHeight: 92, letterSpacing: 0, textCase: "ORIGINAL", key: "fb793c3fefaf04cc9678d96c2424ba97a2e4ce3e" },
  { name: "display-bd-d2", family: "Mona Sans", style: "SemiBold", size: 64, lineHeight: 76, letterSpacing: 0, textCase: "ORIGINAL", key: "c7a415ed83bbc3a0bdb3fcb4db0312fa9ce50d72" },
  { name: "display-bd-d3", family: "Mona Sans", style: "SemiBold", size: 52, lineHeight: 64, letterSpacing: 0, textCase: "ORIGINAL", key: "12017f6dfd9f89ad2d5db076145f4385caff2a41" },
  { name: "heading-sb-h1", family: "Mona Sans", style: "SemiBold", size: 40, lineHeight: 48, letterSpacing: 0, textCase: "ORIGINAL", key: "e2902108c3ad6eb78dd71b9b403a9bfff01d99cd" },
  { name: "heading-sb-h2", family: "Mona Sans", style: "SemiBold", size: 36, lineHeight: 42, letterSpacing: 0, textCase: "ORIGINAL", key: "01beeedb729c863fc812ecd01d9d46b2d51652e8" },
  { name: "heading-sb-h3", family: "Mona Sans", style: "SemiBold", size: 28, lineHeight: 32, letterSpacing: 0, textCase: "ORIGINAL", key: "e220e86fb5e9a5896567ff9b0b5fd92581da5d7f" },
  { name: "heading-sb-h4", family: "Mona Sans", style: "SemiBold", size: 24, lineHeight: 28, letterSpacing: 0, textCase: "ORIGINAL", key: "8a40ecfe5b9d0bad45fc3658bbaead6ee77a851e" },
  { name: "heading-sb-h5", family: "Mona Sans", style: "SemiBold", size: 20, lineHeight: 24, letterSpacing: 0.1, textCase: "ORIGINAL", key: "f64b0a7e21f3c060de6d9bd939562bca6415a494" },
  { name: "heading-sb-h6", family: "Mona Sans", style: "SemiBold", size: 16, lineHeight: 20, letterSpacing: 0.1, textCase: "ORIGINAL", key: "0e5f90469cbf8d53afec31c16a161c11c411a33b" },
  { name: "paragraph-sb-p1", family: "Mona Sans", style: "SemiBold", size: 18, lineHeight: 28, letterSpacing: 0.06, textCase: "ORIGINAL", key: "e7a0741718b64769552f92d99106537db3b6b38a" },
  { name: "paragraph-sb-p2", family: "Mona Sans", style: "SemiBold", size: 16, lineHeight: 26, letterSpacing: 0.06, textCase: "ORIGINAL", key: "5bbd08c7b622eeb25cc5d50ae91469b94a4f90d6" },
  { name: "paragraph-sb-p3", family: "Mona Sans", style: "SemiBold", size: 14, lineHeight: 22, letterSpacing: 0.016, textCase: "ORIGINAL", key: "35be0e0c227cf647db4b5634cb42659ec00675c9" },
  { name: "paragraph-sb-p4", family: "Mona Sans", style: "SemiBold", size: 12, lineHeight: 18, letterSpacing: 0.06, textCase: "ORIGINAL", key: "6142cd1245a2ee21b41e8643eeb5aaa1513bbbaa" },
  { name: "paragraph-sb-l1", family: "Mona Sans", style: "SemiBold", size: 14, lineHeight: 16, letterSpacing: 0.4, textCase: "ORIGINAL", key: "db23b441855401cb5eebe2e1f358d6a9995e6abd" },
  { name: "paragraph-sb-l2", family: "Mona Sans", style: "SemiBold", size: 12, lineHeight: 14, letterSpacing: 0.25, textCase: "ORIGINAL", key: "22a4db8d575aae85e2824ba18c4e20b9169fe52a" },
  { name: "paragraph-md-p1", family: "Mona Sans", style: "Medium", size: 18, lineHeight: 28, letterSpacing: 0.1, textCase: "ORIGINAL", key: "5b3309c4ee8ec1964fe31bacd7fc8866c75b9844" },
  { name: "paragraph-md-p2", family: "Mona Sans", style: "Medium", size: 16, lineHeight: 26, letterSpacing: 0.1, textCase: "ORIGINAL", key: "227f8e306748eb4d1ae03455c1e12f3fa1af61b7" },
  { name: "paragraph-md-p3", family: "Mona Sans", style: "Medium", size: 14, lineHeight: 22, letterSpacing: 0.1, textCase: "ORIGINAL", key: "061e5d58d376d1e31c0ee0fb15ffac129f613a8c" },
  { name: "paragraph-md-p4", family: "Mona Sans", style: "Medium", size: 12, lineHeight: 18, letterSpacing: 0.1, textCase: "ORIGINAL", key: "730d2902941e3ec1ae9550564b6db6a35e009f1c" },
  { name: "paragraph-md-c1", family: "Fira Code", style: "Regular", size: 14, lineHeight: 20, letterSpacing: 0, textCase: "ORIGINAL", key: "0e11bed01f25399ec6e3f64cab58ae114e9844c7" },
  { name: "paragraph-md-l1", family: "Mona Sans", style: "Medium", size: 14, lineHeight: 16, letterSpacing: 0.5, textCase: "ORIGINAL", key: "f1266d48636a88d28f928b2baa6ec1cfe6d2ae1e" },
  { name: "paragraph-md-l2", family: "Mona Sans", style: "Medium", size: 12, lineHeight: 14, letterSpacing: 0.4, textCase: "ORIGINAL", key: "ed7754d1448bfe368e175353c6b60e71e7fb26b6" },
  { name: "overline-sb-ol1", family: "Mona Sans", style: "SemiBold", size: 14, lineHeight: 16, letterSpacing: 1.6, textCase: "UPPER", key: "840530cb2fd67a2a93028fb70bbc2f031ae3fd45" },
  { name: "overline-sb-ol2", family: "Mona Sans", style: "SemiBold", size: 11, lineHeight: 12, letterSpacing: 2, textCase: "UPPER", key: "24ed9d4a70753a6c52613a49f0ce9d88daeabaee" },
  { name: "action-sb-p1", family: "Mona Sans", style: "SemiBold", size: 16, lineHeight: 26, letterSpacing: 0.06, textCase: "ORIGINAL", key: "c69e8658690ca61637bef32a52915db67c6cd32d" },
  { name: "action-sb-p2", family: "Mona Sans", style: "SemiBold", size: 14, lineHeight: 22, letterSpacing: 0.4, textCase: "ORIGINAL", key: "1e7b783591913cfdb3b7337bf1a0a10df13a8074" },
  { name: "action-sb-lk1", family: "Mona Sans", style: "SemiBold", size: 14, lineHeight: 16, letterSpacing: 2, textCase: "UPPER", key: "4316adc1a882176747a0be9f89d2519d58b7241c" },
  { name: "paragraph-rg-p1", family: "Mona Sans", style: "Regular", size: 18, lineHeight: 28, letterSpacing: 0.06, textCase: "ORIGINAL", key: "8404c2ce66fc28df7c26446ea6b0125760602f10" },
  { name: "paragraph-rg-p2", family: "Mona Sans", style: "Regular", size: 16, lineHeight: 20, letterSpacing: 0.06, textCase: "ORIGINAL", key: "410be1bfefe9124a4400796edabc7db67d42a8d7" },
  { name: "paragraph-rg-p3", family: "Mona Sans", style: "Regular", size: 14, lineHeight: 22, letterSpacing: 0.016, textCase: "ORIGINAL", key: "07d852a256b1dad49c0583586b7db2d3cc541c73" },
  { name: "paragraph-rg-p4", family: "Mona Sans", style: "Regular", size: 12, lineHeight: 18, letterSpacing: 0.06, textCase: "ORIGINAL", key: "2677d2a068ff230ddde586885d8ded5e7a6302ec" },
];

const DESIGN_SYSTEM_SPACING_TOKENS = [
  { name: "spacing/sp-0", value: 0, key: "50ad0490c5d25ac61f64f277a65e06d1219b15b6" },
  { name: "spacing/sp-1", value: 1, key: "ed2a836f600f476d9e85b37e1035b0e613d803bf" },
  { name: "spacing/sp-2", value: 2, key: "dddfdc13af45c65b3d26f9441615e4455f8a230d" },
  { name: "spacing/sp-3", value: 4, key: "c71435ff6320acf0ad4c85a9194bec0bd9828ed4" },
  { name: "spacing/sp-4", value: 6, key: "a1f3b90de4c9f839d11244f02a6c0b40cebbef0b" },
  { name: "spacing/sp-5", value: 8, key: "112beca8f77923e53c579888f1d01b4ffeb6fe1e" },
  { name: "spacing/sp-6", value: 10, key: "1c17e9de2db15addf1da012ba9eefca7f5100257" },
  { name: "spacing/sp-7", value: 12, key: "0cee67c35c7e81fef24a614b3a3268a10fc8d88f" },
  { name: "spacing/sp-8", value: 14, key: "a98a35076d78d0d55187427aa83d084c68dc374d" },
  { name: "spacing/sp-9", value: 16, key: "1b47ebb9fc985829802a9b5ad7bae8dce6704ed9" },
  { name: "spacing/sp-10", value: 18, key: "b48f3f491ebea1cd0c23a782c7ae73833f1eb155" },
  { name: "spacing/sp-11", value: 20, key: "5cdcde007672a070ade6b195b388c3e18dc7a2f8" },
  { name: "spacing/sp-12", value: 24, key: "e4b51f2589db2203cdf45175aee3471205b0daa1" },
  { name: "spacing/sp-13", value: 28, key: "5cb400012c4c88d148e1c437204def245122db04" },
  { name: "spacing/sp-14", value: 32, key: "506966dbeed3e251e1e7a0d0dff647e96552d444" },
  { name: "spacing/sp-15", value: 36, key: "c0d99173caa1e45a4ee9de34751ba09bb5b5389c" },
  { name: "spacing/sp-16", value: 40, key: "fd8ea910b75d4cba3fbc2cbf6a74d49f3fb07bef" },
  { name: "spacing/sp-17", value: 42, key: "7a40c5e1b27480092451605e319deb2f3033d0e4" },
  { name: "spacing/sp-18", value: 48, key: "7e4ffdc06e8471f81cfa5628b5d98e242d147a32" },
  { name: "spacing/sp-19", value: 52, key: "a18ba2e0e953c41ea63eacf6701a0d9dceca4695" },
  { name: "spacing/sp-20", value: 56, key: "2f8418f6fef5a47afed4c211e6385769b6a569a4" },
  { name: "spacing/sp-21", value: 64, key: "a760af7a6bca108aa890f495d7fee3fa06b99941" },
  { name: "spacing/sp-22", value: 72, key: "ce5dcfccc623d9cf3cd5ac29e104ba572cd507ee" },
  { name: "spacing/sp-23", value: 80, key: "45d428d49334cbb6dcd46cd7d5bca6a3774c946b" },
  { name: "spacing/sp-24", value: 128, key: "44cfd79009ff8c6d2ea483784b1c17316d8353e1" },
  { name: "spacing/sp-25", value: 160, key: "7a50bc044fc79dd5f82f5619b19f70994ffba709" },
];

const DESIGN_SYSTEM_RADIUS_TOKENS = [
  { name: "corner-radius/cr-0", value: 0, key: "a4fa76d60a97bd7a92f6d517fb577bff91cfece9" },
  { name: "corner-radius/cr-1", value: 1, key: "eff50ae33554874844cb60c3049b9e93609293fe" },
  { name: "corner-radius/cr-2", value: 2, key: "52524435a475cf00656ca64d2dcd83061c711e2f" },
  { name: "corner-radius/cr-3", value: 4, key: "02f9d4eda056346431307e7c5d78d0e7c22553f6" },
  { name: "corner-radius/cr-4", value: 8, key: "37f281b3e437a7fe2bd95e826c639a1361ad9e1d" },
  { name: "corner-radius/cr-5", value: 12, key: "8d17dc922db499ddd6d5efd7611f21ad0fa66329" },
  { name: "corner-radius/cr-6", value: 16, key: "805fcdd1a553fc4c3331f0a45aa5e14ca759e40d" },
  { name: "corner-radius/cr-7", value: 20, key: "8aa648174eba307fe5ab4cc26c2de3b8f6c88d43" },
  { name: "corner-radius/cr-8", value: 24, key: "87d266d8f99248eeec77802b73c4c9de801698e5" },
  { name: "corner-radius/cr-9", value: 28, key: "094c0b7e6c0054e05996ffc3f5fddc4295b62b22" },
  { name: "corner-radius/cr-10", value: 9999, key: "4d21a6af293eb7ba7df81fd98b582361a52e6536" },
];

function hexToColor(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const a = clean.length >= 8 ? parseInt(clean.substring(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function tokenVariant(name) {
  return (name.split("/")[2] || "").startsWith("invert") ? "invert" : "default";
}

const REFERENCE_TOKENS = DESIGN_SYSTEM_COLOR_TOKENS.map((t) => ({
  ...t,
  category: t.name.split("/")[0], // "text" | "bg" | "border"
  variant: tokenVariant(t.name),
  lightColor: hexToColor(t.light),
  lab: srgbToLab(hexToColor(t.light)),
}));
const TOKENS_BY_NAME = new Map(REFERENCE_TOKENS.map((t) => [t.name, t]));
const TOKENS_BY_KEY = new Map(REFERENCE_TOKENS.map((t) => [t.key, t]));
const TEXT_STYLES_BY_KEY = new Map(DESIGN_SYSTEM_TEXT_STYLES.map((s) => [s.key, s]));

// Lets the UI auto-trigger a scan the moment the selection changes.
// Clicking a result row selects that layer on the canvas. That selection
// change must not trigger a rescan of just the one layer, so while the
// selection is the plugin's own pick, scans keep using the user's original
// selection (`roots`). Any selection the user makes clears this.
let pluginSelection = null; // { nodeIds: [ids the plugin selected], roots: [node ids] }

function isPluginSelection() {
  const sel = figma.currentPage.selection;
  if (!pluginSelection || sel.length !== pluginSelection.nodeIds.length) return false;
  const ids = new Set(pluginSelection.nodeIds);
  return sel.every((n) => ids.has(n.id));
}

function notifySelection() {
  if (isPluginSelection()) return;
  pluginSelection = null;
  figma.ui.postMessage({ type: "selection-changed", count: figma.currentPage.selection.length });
}
// Settings live in figma.clientStorage (per user, survives closing the
// plugin) — plugin UIs can't use localStorage. Send them before the first
// selection message so the UI never scans or asks with default settings.
const PREFS_KEY = "prefs:v2";
(async () => {
  let prefs = null;
  try {
    prefs = (await figma.clientStorage.getAsync(PREFS_KEY)) || null;
  } catch (e) {
    prefs = null;
  }
  figma.ui.postMessage({ type: "prefs", prefs });
  notifySelection();
  figma.on("selectionchange", notifySelection);
})();

async function getScanRoots() {
  if (isPluginSelection()) {
    const roots = [];
    for (const id of pluginSelection.roots) {
      const n = await figma.getNodeByIdAsync(id);
      if (n && !n.removed) roots.push(n);
    }
    if (roots.length > 0) return roots;
  }
  return figma.currentPage.selection;
}

// Select one layer, or every layer in a group of similar rows.
async function selectLayers(nodeIds) {
  const nodes = [];
  for (const id of nodeIds) {
    const node = await figma.getNodeByIdAsync(id);
    if (!node || node.removed) continue;
    let page = node.parent;
    while (page && page.type !== "PAGE") page = page.parent;
    if (page === figma.currentPage) nodes.push(node);
  }
  if (nodes.length === 0) return "That layer no longer exists, or is on another page — rescan to refresh the list.";
  if (!pluginSelection) pluginSelection = { nodeIds: [], roots: figma.currentPage.selection.map((n) => n.id) };
  pluginSelection.nodeIds = nodes.map((n) => n.id);
  figma.currentPage.selection = nodes;
  revealBesidePanel(nodes);
  return null;
}

// The plugin window floats over the right side of the canvas, so a plain
// scrollAndZoomIntoView often parks the layer underneath it. Fit the layer
// into the area left of the panel instead, and centre it there.
const PANEL_CLEARANCE = PANEL_WIDTH + 48; // panel + its margin from the edge, in screen px
const MAX_REVEAL_ZOOM = 4; // don't blow a 16px icon up to fill the screen

function revealBesidePanel(nodes) {
  figma.viewport.scrollAndZoomIntoView(nodes);
  const boxes = nodes.map((n) => n.absoluteBoundingBox || { x: n.x, y: n.y, width: n.width, height: n.height });
  const x0 = Math.min(...boxes.map((b) => b.x)), y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.width)), y1 = Math.max(...boxes.map((b) => b.y + b.height));
  const box = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  const bounds = figma.viewport.bounds;
  const screenW = bounds.width * figma.viewport.zoom;
  const screenH = bounds.height * figma.viewport.zoom;
  const freeW = screenW - PANEL_CLEARANCE;
  if (freeW < 200) return; // window too narrow to dodge the panel — keep Figma's framing
  const fit = Math.min(freeW / Math.max(box.width * 1.25, 1), screenH / Math.max(box.height * 1.25, 1));
  const zoom = Math.min(fit, MAX_REVEAL_ZOOM);
  figma.viewport.zoom = zoom;
  // Centre of the free area sits PANEL_CLEARANCE/2 screen px left of the viewport centre.
  figma.viewport.center = {
    x: box.x + box.width / 2 + PANEL_CLEARANCE / 2 / zoom,
    y: box.y + box.height / 2,
  };
}

let variableCache = new Map(); // id -> local Variable

async function loadVariables() {
  variableCache = new Map();
  for (const v of await figma.variables.getLocalVariablesAsync()) variableCache.set(v.id, v);
}

async function getVariableSafe(id) {
  const cached = variableCache.get(id);
  if (cached) return cached;
  try {
    return await figma.variables.getVariableByIdAsync(id);
  } catch (e) {
    return null;
  }
}

async function getStyleSafe(id) {
  try {
    return await figma.getStyleByIdAsync(id);
  } catch (e) {
    return null;
  }
}

function colorsEqual(a, b, eps) {
  if (!a || !b) return false;
  const aa = a.a === undefined ? 1 : a.a;
  const ba = b.a === undefined ? 1 : b.a;
  return (
    Math.abs(a.r - b.r) <= eps &&
    Math.abs(a.g - b.g) <= eps &&
    Math.abs(a.b - b.b) <= eps &&
    Math.abs(aa - ba) <= eps
  );
}

function hex2(v) {
  return Math.round(Math.max(0, Math.min(1, v)) * 255)
    .toString(16)
    .padStart(2, "0");
}

function colorToHex(c) {
  const a = c.a === undefined ? 1 : c.a;
  const base = `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`.toUpperCase();
  return a < 1 ? base + hex2(a).toUpperCase() : base;
}

function formatValue(resolvedType, value) {
  if (value === null || value === undefined) return "?";
  return resolvedType === "COLOR" ? colorToHex(value) : String(Math.round(value * 100) / 100);
}

// ---- Perceptual color difference (CIEDE2000) --------------------------------
// HSL distances don't track what people see, so "invisible difference" is
// measured as ΔE 2000 in CIELAB: below ~1 is imperceptible side by side.
// Verified against the Sharma, Wu & Dalal (2005) reference pairs.

function srgbToLab(c) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const R = lin(c.r);
  const G = lin(c.g);
  const B = lin(c.b);
  const X = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
  const Z = (R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function deltaE2000(l1, l2) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;
  const pow7 = (x) => Math.pow(x, 7);
  const C1 = Math.hypot(l1.a, l1.b);
  const C2 = Math.hypot(l2.a, l2.b);
  const Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(pow7(Cb) / (pow7(Cb) + pow7(25))));
  const a1p = (1 + G) * l1.a;
  const a2p = (1 + G) * l2.a;
  const C1p = Math.hypot(a1p, l1.b);
  const C2p = Math.hypot(a2p, l2.b);
  const hue = (b, a) => {
    if (a === 0 && b === 0) return 0;
    const h = Math.atan2(b, a) * deg;
    return h < 0 ? h + 360 : h;
  };
  const h1p = hue(l1.b, a1p);
  const h2p = hue(l2.b, a2p);
  const dLp = l2.L - l1.L;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lbp = (l1.L + l2.L) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hbp += hbp < 360 ? 360 : -360;
    hbp /= 2;
  }
  const T =
    1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(pow7(Cbp) / (pow7(Cbp) + pow7(25)));
  const Sl = 1 + (0.015 * Math.pow(Lbp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(Math.pow(dLp / Sl, 2) + Math.pow(dCp / Sc, 2) + Math.pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
}

const ICON_NODE_TYPES = new Set(["VECTOR", "BOOLEAN_OPERATION", "STAR", "POLYGON"]);

function isIconNode(node, keywords) {
  if (ICON_NODE_TYPES.has(node.type)) return true;
  const name = node.name.toLowerCase();
  return (keywords.icon || []).some((w) => w && name.includes(w.toLowerCase()));
}

// Layers inside component instances are checked and can be fixed (the fix is
// an override on that copy), but they're tagged with their component so the
// UI can list them in their own section. Many are legacy components that no
// longer exist in gra.UI.ty.
function enclosingInstance(node) {
  for (let n = node; n && n.type !== "PAGE"; n = n.parent) if (n.type === "INSTANCE") return n;
  return null;
}

function collectNodes(roots, includeHidden) {
  const nodes = [];
  const componentOf = new Map(); // node id -> name of the closest instance it sits in
  const visit = (node, component) => {
    if (!includeHidden && node.visible === false) return;
    if (node.locked) return;
    const inside = node.type === "INSTANCE" ? node.name : component;
    nodes.push(node);
    if (inside) componentOf.set(node.id, inside);
    if ("children" in node) {
      for (const child of node.children) visit(child, inside);
    }
  };
  for (const root of roots) {
    const outer = enclosingInstance(root.parent);
    visit(root, outer ? outer.name : null);
  }
  return { nodes, componentOf };
}

// ---- Component-context disambiguation -------------------------------------

function tokenizeLabel(str) {
  if (!str) return new Set();
  const spaced = str.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  const parts = spaced
    .split(/[\/\-_\s]+/)
    .map((s) => s.toLowerCase().trim())
    .filter((s) => s.length >= 2);
  return new Set(parts);
}

function overlapScore(candidate, contextTokens) {
  if (contextTokens.size === 0) return 0;
  let score = 0;
  for (const t of tokenizeLabel(candidate.name)) if (contextTokens.has(t)) score++;
  return score;
}

async function getInstanceInfo(instanceNode, cache) {
  if (cache.has(instanceNode.id)) return cache.get(instanceNode.id);
  let main = null;
  try {
    main = await instanceNode.getMainComponentAsync();
  } catch (e) {
    main = null;
  }
  const info = {
    instanceId: instanceNode.id,
    mainComponentId: main ? main.id : null,
    label: main ? main.name : instanceNode.name,
  };
  cache.set(instanceNode.id, info);
  return info;
}

async function getComponentContext(node, cache) {
  let n = node;
  while (n && n.type !== "PAGE" && n.type !== "DOCUMENT") {
    if (n.type === "INSTANCE") {
      const info = await getInstanceInfo(n, cache);
      return { instanceId: info.instanceId, mainComponentId: info.mainComponentId, label: info.label };
    }
    if (n.type === "COMPONENT" || n.type === "COMPONENT_SET") {
      return { instanceId: null, mainComponentId: n.id, label: n.name };
    }
    n = n.parent;
  }
  return null;
}

async function getSiblingInstances(mainComponentId, excludeInstanceId, pageInstances, cache, limit) {
  const siblings = [];
  for (const inst of pageInstances) {
    if (siblings.length >= limit) break;
    if (inst.id === excludeInstanceId) continue;
    const info = await getInstanceInfo(inst, cache);
    if (info.mainComponentId && info.mainComponentId === mainComponentId) siblings.push(inst);
  }
  return siblings;
}

function readBoundIdForField(node, field) {
  return node.boundVariables && node.boundVariables[field] ? node.boundVariables[field].id : null;
}

// The library key a (sibling) layer is currently bound to, to compare
// against candidate ids.
async function boundKey(node, kind, field) {
  if (kind === "textStyle") {
    if (node.type !== "TEXT" || typeof node.textStyleId !== "string" || !node.textStyleId) return null;
    const style = await getStyleSafe(node.textStyleId);
    return style ? style.key : null;
  }
  if (kind === "paint") {
    const arr = node[field];
    if (!Array.isArray(arr)) return null;
    const paint = arr.find((p) => p.type === "SOLID" && p.boundVariables && p.boundVariables.color);
    if (!paint) return null;
    const v = await getVariableSafe(paint.boundVariables.color.id);
    return v ? v.key : null;
  }
  return null;
}

// Only ever narrows among `candidates` (each { id, name }); never adds one.
async function tieBreak({ node, field, kind, candidates, ctx, pageInstances, instanceInfoCache }) {
  if (!ctx || !ctx.label) return null;

  const ctxTokens = tokenizeLabel(ctx.label);
  if (ctxTokens.size > 0) {
    const scored = candidates.map((v) => ({ v, score: overlapScore(v, ctxTokens) }));
    const maxScore = Math.max(...scored.map((s) => s.score));
    const top = scored.filter((s) => s.score === maxScore && maxScore > 0);
    if (top.length === 1) return { variable: top[0].v, via: `component name (${ctx.label})` };
  }

  if (ctx.instanceId && ctx.mainComponentId) {
    const siblings = await getSiblingInstances(ctx.mainComponentId, ctx.instanceId, pageInstances, instanceInfoCache, MAX_SIBLINGS_CHECKED);
    const tally = new Map();
    for (const sib of siblings) {
      let match = null;
      try {
        match = sib.findOne((n) => n.name === node.name && n.type === node.type);
      } catch (e) {
        match = null;
      }
      if (!match) continue;
      const bound = await boundKey(match, kind, field);
      if (bound && candidates.some((c) => c.id === bound)) tally.set(bound, (tally.get(bound) || 0) + 1);
    }
    if (tally.size > 0) {
      const [bestId] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
      const variable = candidates.find((c) => c.id === bestId);
      if (variable) return { variable, via: "other instances of this component" };
    }
  }

  return null;
}

function statusFor(count, preferredId) {
  if (count === 0) return "unmatched";
  if (count === 1) return "ready";
  return preferredId ? "auto" : "ambiguous";
}

// ---- Colors ---------------------------------------------------------------

function findColorCandidates(category, targetColor, eps) {
  return REFERENCE_TOKENS.filter((t) => t.category === category && colorsEqual(t.lightColor, targetColor, eps));
}

function hasInvertTwin(token) {
  const parts = token.name.split("/");
  if (parts.length !== 4 || token.variant === "invert") return false;
  return [" ", "-"].some((sep) => TOKENS_BY_NAME.has([parts[0], parts[1], `invert${sep}${parts[2]}`, parts[3]].join("/")));
}

function allowedInFamily(token, family) {
  if (family === "invert") return token.variant === "invert" || !hasInvertTwin(token);
  return token.variant !== "invert";
}

async function getColorBinding(node, field, paint) {
  const styleId = node[field === "fills" ? "fillStyleId" : "strokeStyleId"];
  if (typeof styleId === "string" && styleId.length > 0) {
    const style = await getStyleSafe(styleId);
    return { kind: "style", label: style ? style.name : "Unknown style", key: null };
  }
  if (paint.boundVariables && paint.boundVariables.color) {
    const v = await getVariableSafe(paint.boundVariables.color.id);
    return { kind: "variable", label: v ? v.name : "Unknown variable", key: v ? v.key : null };
  }
  return null;
}

// A color with no exact token always gets its nearest tokens as Replace
// options. Up to REVIEW_DELTA_E the difference is slight and bulk Replace is
// fine; past it the layer will look different, so it's set aside for review
// (individual Replace only).
const REVIEW_DELTA_E = 5;

// Greys only match grey tokens and colors only match colored ones, so a grey
// icon is never offered purple just because the lightness is close. Neutral
// tokens are known by their role, not measured chroma: the light brand/error
// tints have low chroma but are still tints.
const NEUTRAL_ROLE = /^(primary|secondary|tertiary|static-black|static-white|white|alpha|invert[ -]?(primary|secondary|tertiary))$/;
const NEUTRAL_MAX_CHROMA = 20; // CIELAB C*; gra.UI.ty's blue-greys sit around 8–14
const isNeutralToken = (t) => NEUTRAL_ROLE.test(t.name.split("/")[2] || "");
// Light tints (pastel pink, pale blue) have low chroma too, so above L 70 a
// color only counts as grey when it's nearly colorless.
const LIGHT_NEUTRAL_MAX_CHROMA = 8;
const isNeutralColor = (lab) => {
  const c = Math.hypot(lab.a, lab.b);
  return c < NEUTRAL_MAX_CHROMA && (lab.L <= 70 || c < LIGHT_NEUTRAL_MAX_CHROMA);
};

// Rough chance (%) that a change of this ΔE reads as clearly different at a
// glance: a logistic curve centred on ΔE 10 (≈10% at 5, 50% at 10, 90% at 15),
// rounded to 5% so it reads as the estimate it is.
function visibleChance(d) {
  const p = 100 / (1 + Math.exp(-(d - 10) / 2.5));
  return Math.min(99, Math.max(5, Math.round(p / 5) * 5));
}

// ---- Icons vs illustrations -------------------------------------------------
// Icons are UI: they always get normal color matching (fills and strokes, even
// at reduced opacity). Illustrations — big vector artwork, logos, mock
// screens — are left alone. Icons are checked first so they can never be
// swept into the illustration bucket.

const SHAPE_TYPES = new Set(["VECTOR", "BOOLEAN_OPERATION", "STAR", "POLYGON", "ELLIPSE", "LINE"]);
const ICON_NAME = /\bicons?\b|^ic[\s_\-/]|\bglyph\b/i;
const ICON_MAX_SIZE = 48; // px, both sides
const ICON_CONTAINER_TYPES = new Set(["INSTANCE", "COMPONENT", "FRAME", "GROUP", "BOOLEAN_OPERATION"]);

function solidFillHex(node) {
  const fill = Array.isArray(node.fills) && node.fills.find((p) => p.type === "SOLID" && p.visible !== false);
  return fill ? colorToHex(fill.color) : null;
}

// 3+ side-by-side shapes in different colors: a drawing (traffic lights,
// artwork), not a one-color icon.
function isMulticolorDrawing(container) {
  if (!("children" in container)) return false;
  const shapes = container.children.filter((c) => SHAPE_TYPES.has(c.type));
  return shapes.length >= 3 && new Set(shapes.map(solidFillHex).filter(Boolean)).size >= 2;
}

function looksLikeIconBox(n) {
  if (!ICON_CONTAINER_TYPES.has(n.type) || n.width > ICON_MAX_SIZE || n.height > ICON_MAX_SIZE) return false;
  if (n.findOne && n.findOne((c) => c.type === "TEXT")) return false;
  return !isMulticolorDrawing(n);
}

function namedLikeIcon(n, keywords) {
  const name = n.name || "";
  if (ICON_NAME.test(name)) return true;
  const lower = name.toLowerCase();
  return ((keywords && keywords.icon) || []).some((w) => w && lower.includes(w.toLowerCase()));
}

// The icon a layer belongs to (itself or a close parent), or null. Stops once
// the walk reaches something clearly bigger than an icon.
function iconContainer(node, keywords) {
  if (node.type === "TEXT") return null;
  for (let n = node, depth = 0; n && n.type !== "PAGE" && depth < 5; depth++, n = n.parent) {
    if (n !== node && n.width > ICON_MAX_SIZE * 2 && n.height > ICON_MAX_SIZE * 2) break;
    if (STRONG_ARTWORK_NAME.test(n.name)) return null; // "Chrome icon (placeholder)" is a logo stand-in
    if (namedLikeIcon(n, keywords)) return n;
    if (n !== node && looksLikeIconBox(n)) return n;
  }
  return null;
}

// Artwork names. Strong ones win over "icon" in the same name; weak ones
// ("image", "photo") lose to it, so an "Image icon" is still an icon.
const STRONG_ARTWORK_NAME = /illustration|logo|graphic|artwork|avatar|mascot|emoji|flag|placeholder|traffic light|mockup|screenshot/i;
const WEAK_ARTWORK_NAME = /image|picture|photo/i;

// A layer named like a UI part (a status badge on an app logo, say) is UI even
// when it sits inside artwork, so the name walk stops there.
const UI_PART_NAME = /badge|indicator|status|button|chip|tag|toggle|notification|counter/i;

// Colors inside artwork aren't UI and shouldn't be nudged toward UI tokens.
// A non-text layer is artwork when a close layer is named like artwork (and no
// closer one is a UI part or an icon), or — for shapes — when it's part of a
// multi-color drawing, a boolean shape, or 3+ sibling shapes.
function isIllustration(node, keywords) {
  if (node.type === "TEXT" || iconContainer(node, keywords)) return false;
  for (let n = node, depth = 0; n && n.type !== "PAGE" && depth < 4; depth++, n = n.parent) {
    if (UI_PART_NAME.test(n.name)) return false;
    if (STRONG_ARTWORK_NAME.test(n.name) || WEAK_ARTWORK_NAME.test(n.name)) return true;
  }
  if (!SHAPE_TYPES.has(node.type)) return false;
  const parent = node.parent;
  if (parent && isMulticolorDrawing(parent)) return true;
  for (let n = parent, depth = 0; n && n.type !== "PAGE" && depth < 6; depth++, n = n.parent) {
    if (n.type === "BOOLEAN_OPERATION") return true;
  }
  return !!parent && "children" in parent && parent.children.filter((c) => SHAPE_TYPES.has(c.type)).length >= 3;
}

async function processColorPaint({ node, field, paintIndex, paint, category, fallbackCategory, ctx, options, family, pageInstances, instanceInfoCache, inIcon, forceCheck }) {
  const binding = await getColorBinding(node, field, paint);
  if (binding && binding.key && TOKENS_BY_KEY.has(binding.key)) return null; // already on the library token
  if (binding && !options.migrateLegacy) return null;
  // On an old token or style (not gra.UI.ty). These are always flagged — even
  // inside illustrations or at reduced opacity — so they can be moved to the
  // new tokens. Only plain hex values get left alone there.
  const onOldToken = !!binding;

  const base = {
    nodeId: node.id,
    nodeName: node.name,
    field,
    kind: "paint",
    group: "color",
    paintIndex,
    category,
    fallbackCategory: fallbackCategory || null,
    contextLabel: ctx ? ctx.label : null,
    oldKind: binding ? binding.kind : null,
    oldLabel: binding ? binding.label : null,
  };

  // A semi-transparent color is usually meant to blend with whatever is
  // behind it, so it's listed for reference but never matched or flagged.
  const opacity = paint.opacity === undefined ? 1 : paint.opacity;
  // Icons still need a token at reduced opacity: the color gets linked and the
  // paint keeps its opacity, so it looks the same.
  const opacityNote = opacity < 0.999 ? `keeps its ${Math.round(opacity * 100)}% opacity` : null;
  if (opacity < 0.999 && !inIcon && !onOldToken && !forceCheck) {
    return {
      ...base,
      usedFallback: false,
      resolvedVia: null,
      currentValueLabel: `${formatValue("COLOR", paint.color)} at ${Math.round(opacity * 100)}% opacity`,
      candidates: [],
      defaultVariableId: null,
      status: "skipped",
      note: null,
      skipReason: null,
      replaceOptions: [],
    };
  }

  const eps = options.colorEpsilon;
  const target = { r: paint.color.r, g: paint.color.g, b: paint.color.b, a: 1 };

  let refCandidates = findColorCandidates(category, target, eps);
  let usedFallback = false;
  if (refCandidates.length === 0 && fallbackCategory) {
    refCandidates = findColorCandidates(fallbackCategory, target, eps);
    usedFallback = refCandidates.length > 0;
  }

  let allowed = refCandidates.filter((t) => allowedInFamily(t, family));
  const excluded = refCandidates.filter((t) => !allowedInFamily(t, family));
  let note = null;
  if (allowed.length === 0 && excluded.length > 0) {
    note =
      family === "invert"
        ? `only matches "${excluded[0].name}", which has an invert twin — invert mode is on, so it's excluded`
        : `only matches "${excluded[0].name}", an invert token — turn on Invert mode in settings to use invert tokens`;
  }

  // No usable exact token: accept the nearest one if the difference is
  // invisible (ΔE 2000 below the threshold). Otherwise offer the nearest few
  // behind an explicit Replace, since those change how the layer looks; past
  // the review threshold the row needs a human look before replacing. Only
  // tokens an exact match could have used are considered — same category,
  // allowed family, solid.
  let deltaE = null;
  let replaceOptions = [];
  let needsReview = false;
  if (allowed.length === 0) {
    const maxDeltaE = options.maxDeltaE === undefined ? 1 : options.maxDeltaE;
    const reviewDeltaE = options.reviewDeltaE === undefined ? REVIEW_DELTA_E : options.reviewDeltaE;
    const lab = srgbToLab(target);
    const neutral = isNeutralColor(lab);
    const score = (cat, inFamily) => {
      const pool = REFERENCE_TOKENS.filter((t) => t.category === cat && t.lightColor.a >= 0.999 && allowedInFamily(t, family) === inFamily);
      const sameKind = pool.filter((t) => isNeutralToken(t) === neutral);
      return (sameKind.length ? sameKind : pool).map((t) => ({ t, d: deltaE2000(lab, t.lab) })).sort((a, b) => a.d - b.d);
    };
    let cat = category;
    let scored = score(cat, true);
    let fromFallback = false;
    if (scored.length === 0 && fallbackCategory) {
      cat = fallbackCategory;
      scored = score(cat, true);
      fromFallback = true;
    }
    if (scored.length > 0) {
      const best = scored[0];
      if (best.d < maxDeltaE) {
        allowed = scored.filter((x) => x.d - best.d < 0.01).map((x) => x.t);
        deltaE = best.d;
        usedFallback = fromFallback;
      } else {
        // A static token that looks the same as a theme-aware one already
        // offered is just noise in the picker.
        const picked = [];
        for (const x of scored) {
          if (picked.length === 3) break;
          if (picked.length && x.d > scored[0].d + 10) break; // a far-off alternative (purple for a grey) is noise
          if (x.t.name.includes("/static-") && picked.some((p) => p.t.light === x.t.light)) continue;
          picked.push(x);
        }
        replaceOptions = picked.map((x) => ({
          id: x.t.key,
          name: x.t.name,
          value: `${x.t.light} · ΔE ${x.d.toFixed(1)}${x.d > reviewDeltaE ? " · visible change" : ""}`,
          far: x.d > reviewDeltaE,
          visibleChance: x.d > reviewDeltaE ? visibleChance(x.d) : null,
          changes: [
            `Color: ${formatValue("COLOR", target)} → ${x.t.light}`,
            x.d > reviewDeltaE
              ? `ΔE ${x.d.toFixed(1)} — about ${visibleChance(x.d)}% likely to look very different`
              : `ΔE ${x.d.toFixed(1)} — a slight difference`,
          ],
          collectionName: LIBRARY_LABEL,
        }));
        needsReview = best.d > reviewDeltaE;
        if (!note) {
          note = needsReview
            ? `nearest is ${best.t.name} (${best.t.light}), ΔE ${best.d.toFixed(1)} — there may be visible differences, check before replacing`
            : `nearest is ${best.t.name} (${best.t.light}), ΔE ${best.d.toFixed(1)} — a slight visible difference`;
        }
        // Dark screens built in a light file usually want the invert family.
        const other = score(cat, false)[0];
        if (other && other.d < best.d - 1) {
          note += ` · ${other.t.name} is closer (ΔE ${other.d.toFixed(1)}) — ${family === "invert" ? "try turning Invert mode off" : "try Invert mode"}`;
        }
      }
    }
  }

  const isStatic = (t) => t.name.includes("/static-");
  const candidates = allowed
    .slice()
    .sort((a, b) => Number(isStatic(a)) - Number(isStatic(b))) // everyday tokens first, so an unresolved tie defaults to one
    .map((t) => ({ id: t.key, name: t.name, value: t.light, collectionName: LIBRARY_LABEL }));

  // static-black/white tokens share values with the everyday ones (e.g. both
  // #16191D) but never change in dark mode; the theme-aware one is the usual
  // intent, so it wins a tie. The static option stays in the dropdown.
  let resolvedVia = null;
  let preferredId = null;
  const themed = candidates.filter((c) => !c.name.includes("/static-"));
  if (candidates.length > 1 && themed.length === 1) {
    preferredId = themed[0].id;
    resolvedVia = "theme-aware token preferred over static";
  } else if (candidates.length > 1) {
    const pool = themed.length > 0 ? themed : candidates;
    const tie = await tieBreak({ node, field, kind: "paint", candidates: pool, ctx, pageInstances, instanceInfoCache });
    if (tie) {
      resolvedVia = tie.via;
      preferredId = tie.variable.id;
    }
  }
  if (!note && candidates.length === 1 && candidates[0].name.includes("/static-")) {
    note = "static token — stays the same color in dark mode";
  }

  let status = statusFor(candidates.length, preferredId);
  const defaultVariableId = candidates.length === 1 ? candidates[0].id : preferredId || (candidates[0] ? candidates[0].id : null);
  if (deltaE !== null) {
    // Close-but-not-exact matches are pre-checked but kept out of the plain
    // "Ready" bucket so they're easy to review.
    if (status === "ready") status = "auto";
    const via = `invisible difference (ΔE ${deltaE.toFixed(1)})`;
    resolvedVia = resolvedVia ? `${resolvedVia} · ${via}` : via;
    const chosen = candidates.find((c) => c.id === defaultVariableId);
    const invisible = `${formatValue("COLOR", target)} → ${chosen ? chosen.value : "token"} is not visible to the eye`;
    note = note ? `${invisible} · ${note}` : invisible;
  }

  if (opacityNote) note = note ? `${note} · ${opacityNote}` : opacityNote;
  const inArtwork = !inIcon && !forceCheck && isIllustration(node, options.keywords);
  if (inArtwork && onOldToken) {
    const why = "inside an illustration, but on an old token — move it to gra.UI.ty";
    note = note ? `${why} · ${note}` : why;
  }
  // Plain hex in artwork is the artwork's own color: leave it, matched or not.
  if (inArtwork && !onOldToken) {
    return {
      ...base,
      usedFallback: false,
      resolvedVia: null,
      currentValueLabel: formatValue("COLOR", target),
      candidates: [],
      defaultVariableId: null,
      status: "skipped",
      note: null,
      skipReason: "part of an illustration",
      replaceOptions: [],
    };
  }

  return {
    ...base,
    usedFallback,
    resolvedVia,
    currentValueLabel: `${formatValue("COLOR", target)}${opacityNote ? ` at ${Math.round(opacity * 100)}%` : ""}`,
    candidates,
    defaultVariableId,
    status,
    note,
    replaceOptions,
    needsReview: status === "unmatched" && needsReview,
  };
}

// ---- Text styles ------------------------------------------------------------

const round = (x, places) => Math.round(x * Math.pow(10, places)) / Math.pow(10, places);
const near = (a, b, eps) => a !== null && Math.abs(a - b) <= eps;

function readTextProps(node) {
  const m = figma.mixed;
  if ([node.fontName, node.fontSize, node.lineHeight, node.letterSpacing, node.textCase].some((v) => v === m)) return null;
  const size = node.fontSize;
  const lh = node.lineHeight;
  const ls = node.letterSpacing;
  return {
    family: node.fontName.family,
    style: node.fontName.style,
    size,
    lineHeight: lh.unit === "PIXELS" ? lh.value : lh.unit === "PERCENT" ? (lh.value * size) / 100 : null,
    letterSpacing: ls.unit === "PIXELS" ? ls.value : (ls.value * size) / 100,
    textCase: node.textCase,
    // All-caps on screen, whether set as a text case or typed in capitals —
    // either way the right style is an uppercase one (the overlines).
    upper: node.textCase === "UPPER" || isTypedInCaps(node.characters),
  };
}

function isTypedInCaps(str) {
  const letters = (str || "").replace(/[^A-Za-z]/g, "");
  return letters.length >= 2 && letters === letters.toUpperCase();
}

// Line height may be off by up to this many px; everything else must be exact.
const LINE_HEIGHT_TOLERANCE = 4;

function matchesExceptLineHeight(s, p) {
  return (
    s.family === p.family &&
    s.style === p.style &&
    near(p.size, s.size, 0.01) &&
    near(p.letterSpacing, s.letterSpacing, 0.005) &&
    s.textCase === p.textCase
  );
}

// Exact line-height matches win outright. Otherwise every style within the
// tolerance is a candidate, nearest first, and `nearest` holds the closest
// ones (more than one only when two styles are equally close).
function findTextStyleCandidates(p) {
  const pool = DESIGN_SYSTEM_TEXT_STYLES.filter((s) => matchesExceptLineHeight(s, p));
  // Auto line height has no px value to compare, so every otherwise-matching
  // style counts and none is "nearer" than another.
  if (p.lineHeight === null) return { styles: pool, nearest: pool, approximate: pool.length > 0 };
  const exact = pool.filter((s) => near(p.lineHeight, s.lineHeight, 0.01));
  if (exact.length > 0) return { styles: exact, nearest: exact, approximate: false };
  const within = pool
    .map((s) => ({ s, d: Math.abs(p.lineHeight - s.lineHeight) }))
    .filter((x) => x.d <= LINE_HEIGHT_TOLERANCE + 0.01)
    .sort((a, b) => a.d - b.d);
  if (within.length === 0) return { styles: [], nearest: [], approximate: false };
  const best = within[0].d;
  return {
    styles: within.map((x) => x.s),
    nearest: within.filter((x) => x.d - best < 0.01).map((x) => x.s),
    approximate: true,
  };
}

// What applying style `s` to a layer with props `p` visibly changes, one
// line per property — shown before a Replace so nothing is a surprise.
function textStyleChanges(p, s) {
  const out = [];
  if (p.family !== s.family || p.style !== s.style) out.push(`Font: ${p.family} ${p.style} → ${s.family} ${s.style}`);
  if (!near(p.size, s.size, 0.01)) out.push(`Size: ${round(p.size, 2)} → ${s.size}px`);
  if (p.lineHeight === null) out.push(`Line height: Auto → ${s.lineHeight}px`);
  else if (!near(p.lineHeight, s.lineHeight, 0.01)) out.push(`Line height: ${round(p.lineHeight, 2)} → ${s.lineHeight}px`);
  if (!near(p.letterSpacing, s.letterSpacing, 0.005)) out.push(`Letter spacing: ${round(p.letterSpacing, 3)} → ${s.letterSpacing}px`);
  // Text typed in capitals looks uppercase either way, so only a real change of look is listed.
  if (s.textCase === "UPPER" && !p.upper) out.push("Case: → uppercase");
  if (s.textCase !== "UPPER" && p.textCase === "UPPER") out.push("Case: uppercase → as typed");
  return out.length ? out : ["Links the layer to the style — no visible change"];
}

function describeTextProps(p) {
  const lh = p.lineHeight === null ? "auto" : round(p.lineHeight, 2);
  return `${p.family} ${p.style} ${round(p.size, 2)}/${lh}, spacing ${round(p.letterSpacing, 3)}${p.textCase === "UPPER" ? ", uppercase" : ""}`;
}

// For an unmatched layer: which same-font, same-size style is closest, and
// what's different — so the fix is obvious rather than a bare "no match".
const WEIGHT_WORDS = [
  ["extralight", 200], ["ultralight", 200], ["semibold", 600], ["demibold", 600], ["extrabold", 800], ["ultrabold", 800],
  ["thin", 100], ["light", 300], ["regular", 400], ["normal", 400], ["book", 400], ["roman", 400],
  ["medium", 500], ["bold", 700], ["black", 900], ["heavy", 900],
];

function styleWeight(style) {
  const s = style.toLowerCase().replace(/[\s-]/g, "");
  for (const [word, weight] of WEIGHT_WORDS) if (s.includes(word)) return weight;
  return 400;
}

const isMonospace = (family) => /mono|code|courier|consol/i.test(family);

// For a text layer that matches no style: every gra.UI.ty style ranked by how
// little applying it would change the layer — size matters most, then
// weight, case, letter spacing and line height. Monospace text prefers the
// code style; everything else never gets it.
function rankTextStyles(p) {
  const mono = isMonospace(p.family);
  // Uppercase text only gets uppercase styles, and vice versa — case is part
  // of what a style means (an overline isn't a paragraph).
  const sameCase = DESIGN_SYSTEM_TEXT_STYLES.filter((s) => (s.textCase === "UPPER") === !!p.upper);
  return (sameCase.length ? sameCase : DESIGN_SYSTEM_TEXT_STYLES).map((s) => {
    let score = Math.abs(s.size - p.size) * 10;
    score += (Math.abs(styleWeight(s.style) - styleWeight(p.style)) / 100) * 6;
    score += (s.textCase === "UPPER") === !!p.upper ? 0 : 8;
    score += Math.abs(s.letterSpacing - p.letterSpacing) * 4;
    if (p.lineHeight !== null) score += Math.abs(s.lineHeight - p.lineHeight);
    if (isMonospace(s.family) !== mono) score += 60;
    return { s, score };
  }).sort((a, b) => a.score - b.score);
}

function closestStyleNote(p) {
  const all = DESIGN_SYSTEM_TEXT_STYLES;
  if (!all.some((s) => s.family === p.family)) return `"${p.family}" isn't a gra.UI.ty font`;
  if (!all.some((s) => s.family === p.family && s.style === p.style)) return `no gra.UI.ty style uses ${p.family} ${p.style}`;
  const same = all.filter((s) => s.family === p.family && s.style === p.style && near(p.size, s.size, 0.01));
  if (same.length === 0) return `no gra.UI.ty ${p.family} ${p.style} style at ${round(p.size, 2)}px`;
  if (same.length > 2) return `no ${round(p.size, 2)}px ${p.style} style has this exact letter spacing and case`;
  const parts = same.map((s) => {
    const diffs = [];
    if (p.lineHeight !== null && !near(p.lineHeight, s.lineHeight, LINE_HEIGHT_TOLERANCE + 0.01)) diffs.push(`line height within ${LINE_HEIGHT_TOLERANCE}px of ${s.lineHeight}`);
    if (!near(p.letterSpacing, s.letterSpacing, 0.005)) diffs.push(`letter spacing ${s.letterSpacing}`);
    if (s.textCase !== p.textCase) diffs.push(s.textCase === "UPPER" ? "uppercase" : "no uppercase");
    return `${s.name} (needs ${diffs.join(", ")})`;
  });
  return `closest: ${parts.join(" or ")}`;
}

function textEntry(node, fields) {
  return {
    nodeId: node.id,
    nodeName: node.name,
    field: "textStyle",
    kind: "textStyle",
    group: "text",
    paintIndex: null,
    category: "type",
    fallbackCategory: null,
    usedFallback: false,
    contextLabel: null,
    resolvedVia: null,
    currentValueLabel: null,
    candidates: [],
    defaultVariableId: null,
    status: "unmatched",
    oldKind: null,
    oldLabel: null,
    note: null,
    replaceOptions: [],
    ...fields,
  };
}

async function processTextStyle({ node, ctx, options, pageInstances, instanceInfoCache }) {
  const styleId = node.textStyleId;
  if (styleId === figma.mixed) {
    return textEntry(node, { note: "uses more than one text style inside the layer — fix it by hand" });
  }
  let oldLabel = null;
  if (typeof styleId === "string" && styleId.length > 0) {
    const style = await getStyleSafe(styleId);
    if (style && TEXT_STYLES_BY_KEY.has(style.key)) return null; // already on the library style
    if (!options.migrateLegacy) return null;
    oldLabel = style ? style.name : "Unknown style";
  }

  const props = readTextProps(node);
  if (!props) {
    return textEntry(node, { oldKind: oldLabel ? "style" : null, oldLabel, note: "has mixed fonts or sizes inside the layer — fix it by hand" });
  }

  const { styles, nearest, approximate } = findTextStyleCandidates(props);
  const toCandidate = (s) => ({ id: s.key, name: s.name, value: `${s.size}/${s.lineHeight}`, collectionName: LIBRARY_LABEL });
  const candidates = styles.map(toCandidate);

  let resolvedVia = null;
  let preferredId = null;
  if (candidates.length > 1) {
    if (nearest.length === 1) {
      preferredId = nearest[0].key;
      resolvedVia = "closest line height";
    } else {
      const tie = await tieBreak({ node, field: "textStyle", kind: "textStyle", candidates: nearest.map(toCandidate), ctx, pageInstances, instanceInfoCache });
      if (tie) {
        resolvedVia = tie.via;
        preferredId = tie.variable.id;
      }
    }
  }

  const defaultVariableId = candidates.length === 1 ? candidates[0].id : preferredId || (nearest[0] ? nearest[0].key : null);
  let note = null;
  if (candidates.length === 0) {
    note = closestStyleNote(props);
  } else if (approximate) {
    const decided = candidates.length === 1 || preferredId;
    const chosen = decided ? styles.find((s) => s.key === defaultVariableId) : null;
    const current = props.lineHeight === null ? "line height is Auto" : `line height ${round(props.lineHeight, 2)} isn't exact`;
    note = chosen
      ? `${current} — applying ${chosen.name} sets it to ${chosen.lineHeight}`
      : `${current} — the style you pick sets its own line height`;
  }

  return textEntry(node, {
    contextLabel: ctx ? ctx.label : null,
    resolvedVia,
    currentValueLabel: describeTextProps(props),
    candidates,
    defaultVariableId,
    status: statusFor(candidates.length, preferredId),
    oldKind: oldLabel ? "style" : null,
    oldLabel,
    note,
    replaceOptions:
      candidates.length === 0
        ? rankTextStyles(props)
            .slice(0, 3)
            .map(({ s }) => ({
              id: s.key,
              name: s.name,
              value: `${s.family} ${s.style} ${s.size}/${s.lineHeight}`,
              changes: textStyleChanges(props, s),
              collectionName: LIBRARY_LABEL,
            }))
        : [],
  });
}

// ---- Spacing & corner radius --------------------------------------------------
// Every token in each set has a unique value, so matching is exact (within the
// spacing tolerance) and never ties.

const SPACING_BY_KEY = new Map(DESIGN_SYSTEM_SPACING_TOKENS.map((t) => [t.key, t]));
const RADIUS_BY_KEY = new Map(DESIGN_SYSTEM_RADIUS_TOKENS.map((t) => [t.key, t]));
const PILL_RADIUS = DESIGN_SYSTEM_RADIUS_TOKENS.find((t) => t.value >= 9999) || null;

const PADDING_FIELDS = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
const CORNER_FIELDS = ["topLeftRadius", "topRightRadius", "bottomRightRadius", "bottomLeftRadius"];
const SIDE_NAMES = {
  paddingTop: "top",
  paddingRight: "right",
  paddingBottom: "bottom",
  paddingLeft: "left",
  topLeftRadius: "top-left",
  topRightRadius: "top-right",
  bottomRightRadius: "bottom-right",
  bottomLeftRadius: "bottom-left",
};

function paddingLabel(fields) {
  if (fields.length === 4) return "padding";
  const set = new Set(fields);
  if (fields.length === 2 && set.has("paddingTop") && set.has("paddingBottom")) return "vertical padding";
  if (fields.length === 2 && set.has("paddingLeft") && set.has("paddingRight")) return "horizontal padding";
  return `padding (${fields.map((f) => SIDE_NAMES[f]).join(", ")})`;
}

function radiusLabel(fields) {
  return fields.length === 4 ? "corner radius" : `corner radius (${fields.map((f) => SIDE_NAMES[f]).join(", ")})`;
}

// Groups sibling fields (the four paddings, or the four corners) that share a
// value, so 16px padding all round is one row, not four. Fields already on a
// library token are dropped; fields on anything else are kept only when "fix
// legacy" is on.
async function collectNumberGroups(node, fields, tokensByKey, migrateLegacy) {
  const groups = new Map();
  for (const field of fields) {
    const value = node[field];
    if (typeof value !== "number") continue;
    const boundId = readBoundIdForField(node, field);
    let oldLabel = null;
    if (boundId) {
      const v = await getVariableSafe(boundId);
      if (v && tokensByKey.has(v.key)) continue;
      if (!migrateLegacy) continue;
      oldLabel = v ? v.name : "Unknown variable";
    }
    const g = groups.get(value) || { value, fields: [], oldLabels: new Set() };
    g.fields.push(field);
    if (oldLabel) g.oldLabels.add(oldLabel);
    groups.set(value, g);
  }
  return [...groups.values()];
}

function nearestTokens(tokens, value) {
  const regular = tokens.filter((t) => t !== PILL_RADIUS);
  if (regular.length === 0) return [];
  const best = Math.min(...regular.map((t) => Math.abs(t.value - value)));
  return regular.filter((t) => Math.abs(t.value - value) === best);
}

function nearestTokenNote(tokens, value) {
  const nearest = nearestTokens(tokens, value);
  if (nearest.length === 0) return null;
  return `no token is ${round(value, 2)}px — nearest is ${nearest.map((t) => `${t.name} (${t.value}px)`).join(" or ")}`;
}

const capitalizeFirst = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const numberOption = (t) => ({ id: t.key, name: t.name, value: `${t.value}px`, collectionName: LIBRARY_LABEL });

// Unmatched rows carry `replaceOptions`: the nearest tokens, offered behind an
// explicit "Replace" button because applying one changes the value.
function numberEntry(node, { fields, value, oldLabels, label, category, group, token, note, tokens }) {
  const candidates = token ? [numberOption(token)] : [];
  const replaceOptions = token
    ? []
    : nearestTokens(tokens, value).map((t) => ({ ...numberOption(t), changes: [`${capitalizeFirst(label)}: ${round(value, 2)}px → ${t.value}px`] }));
  return {
    nodeId: node.id,
    nodeName: node.name,
    field: fields.join(","),
    fields,
    label,
    kind: "number",
    group,
    paintIndex: null,
    category,
    fallbackCategory: null,
    usedFallback: false,
    contextLabel: null,
    resolvedVia: null,
    currentValueLabel: `${round(value, 2)}px`,
    candidates,
    defaultVariableId: token ? token.key : null,
    status: token ? "ready" : "unmatched",
    oldKind: oldLabels.size ? "variable" : null,
    oldLabel: oldLabels.size ? [...oldLabels].join(", ") : null,
    note,
    replaceOptions,
  };
}

async function processSpacing(node, options) {
  if (node.layoutMode !== "HORIZONTAL" && node.layoutMode !== "VERTICAL") return [];
  const groups = [];
  const gapFields = [];
  if (node.primaryAxisAlignItems !== "SPACE_BETWEEN") gapFields.push(["itemSpacing", "gap"]); // auto gap has no value
  if (node.layoutWrap === "WRAP" && typeof node.counterAxisSpacing === "number") gapFields.push(["counterAxisSpacing", "row gap"]);
  for (const [field, label] of gapFields) {
    for (const g of await collectNumberGroups(node, [field], SPACING_BY_KEY, options.migrateLegacy)) groups.push({ ...g, label, group: "spacing" });
  }
  for (const g of await collectNumberGroups(node, PADDING_FIELDS, SPACING_BY_KEY, options.migrateLegacy)) {
    groups.push({ ...g, label: paddingLabel(g.fields), group: "padding" });
  }
  return groups
    .filter((g) => g.value !== 0 || g.oldLabels.size > 0) // an untouched 0 isn't worth a row
    .map((g) => {
      // Negative spacing (overlapping avatars, stacked cards) is a deliberate
      // layout choice with no token to map to — list it, but leave it alone.
      if (g.value < 0) {
        const e = numberEntry(node, { ...g, category: "spacing", tokens: [], token: null, note: null });
        return { ...e, status: "skipped", skipReason: "negative — likely an intentional overlap", replaceOptions: [] };
      }
      const token = DESIGN_SYSTEM_SPACING_TOKENS.find((t) => Math.abs(t.value - g.value) <= options.numberEpsilon) || null;
      return numberEntry(node, { ...g, category: "spacing", tokens: DESIGN_SYSTEM_SPACING_TOKENS, token, note: token ? null : nearestTokenNote(DESIGN_SYSTEM_SPACING_TOKENS, g.value) });
    });
}

async function processRadius(node, options) {
  if (!("topLeftRadius" in node)) return [];
  const minSide = Math.min(node.width, node.height);
  const out = [];
  for (const g of await collectNumberGroups(node, CORNER_FIELDS, RADIUS_BY_KEY, options.migrateLegacy)) {
    if (g.value === 0 && g.oldLabels.size === 0) continue;
    let token = DESIGN_SYSTEM_RADIUS_TOKENS.find((t) => Math.abs(t.value - g.value) <= options.numberEpsilon) || null;
    let note = null;
    // Figma caps a radius at half the shorter side, so any radius that big
    // already renders fully round — identical to the 9999 pill token.
    if (!token && PILL_RADIUS && minSide > 0 && g.value >= minSide / 2) {
      token = PILL_RADIUS;
      note = `${round(g.value, 2)}px already fully rounds this ${round(node.width, 0)}×${round(node.height, 0)} layer — the pill token looks the same`;
    }
    if (!token) note = nearestTokenNote(DESIGN_SYSTEM_RADIUS_TOKENS, g.value);
    out.push(numberEntry(node, { ...g, label: radiusLabel(g.fields), category: "radius", group: "radius", tokens: DESIGN_SYSTEM_RADIUS_TOKENS, token, note }));
  }
  return out;
}

// ---- Scan -------------------------------------------------------------------

// ---- Manual overrides -------------------------------------------------------
// A designer can ignore a layer (or everything inside a container), or force a
// check on something the plugin left alone. Saved as plugin data on the layer,
// so it sticks across scans and for everyone working in the file.
const OVERRIDE_KEY = "tokenSwapper.override"; // "ignore" | "ignore-tree" | "check"
const CONTAINER_TYPES = new Set(["FRAME", "GROUP", "INSTANCE", "COMPONENT", "BOOLEAN_OPERATION"]);

function readOverride(node) {
  try {
    return node.getPluginData(OVERRIDE_KEY) || "";
  } catch (e) {
    return "";
  }
}

// The closest ancestor (or self) ignored together with its contents.
function treeIgnore(n, cache) {
  if (!n || n.type === "PAGE" || n.type === "DOCUMENT") return null;
  if (cache.has(n.id)) return cache.get(n.id);
  const r = readOverride(n) === "ignore-tree" ? { id: n.id, reason: `ignored with everything in “${n.name}”` } : treeIgnore(n.parent, cache);
  cache.set(n.id, r);
  return r;
}

function ignoreInfo(node, cache) {
  if (readOverride(node) === "ignore") return { id: node.id, reason: "ignored by you" };
  return treeIgnore(node, cache);
}

// Up to two enclosing containers, offered as "Ignore everything in …".
function ignoreContainers(node) {
  const out = [];
  for (let n = node.parent; n && n.type !== "PAGE" && out.length < 2; n = n.parent) {
    if (CONTAINER_TYPES.has(n.type)) out.push({ id: n.id, name: n.name });
  }
  return out;
}

async function scan(options) {
  await loadVariables();
  const family = options.invertMode ? "invert" : "default";

  const roots = await getScanRoots();
  const instanceInfoCache = new Map();
  const pageInstances = figma.currentPage.findAllWithCriteria({ types: ["INSTANCE"] });

  const plan = [];
  let counter = 0;
  const ignoreCache = new Map();
  let current = null; // { ignored, forced, containers } for the node being scanned
  const push = (entry) => {
    if (!entry) return;
    entry.id = `plan-${counter++}`;
    entry.containers = current.containers;
    if (current.component) entry.inComponent = current.component;
    if (current.forced) entry.forced = true;
    if (current.ignored) {
      Object.assign(entry, {
        status: "skipped",
        skipReason: current.ignored.reason,
        ignoredById: current.ignored.id,
        candidates: [],
        defaultVariableId: null,
        replaceOptions: [],
        needsReview: false,
      });
    }
    plan.push(entry);
  };

  const { nodes, componentOf } = collectNodes(roots, options.includeHidden);
  const truncated = nodes.length > MAX_NODES;
  const scanned = nodes.slice(0, MAX_NODES);

  // Progress for the scanning screen: the total up front, then a tick every
  // PROGRESS_EVERY layers. Yielding briefly lets the message reach the UI.
  const PROGRESS_EVERY = 40;
  figma.ui.postMessage({ type: "scan-progress", done: 0, total: scanned.length });
  let done = 0;
  for (const node of scanned) {
    if (++done % PROGRESS_EVERY === 0) {
      figma.ui.postMessage({ type: "scan-progress", done, total: scanned.length });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const isText = node.type === "TEXT";
    const ctx = await getComponentContext(node, instanceInfoCache);
    const iconHost = isText ? null : iconContainer(node, options.keywords);
    const forceCheck = readOverride(node) === "check";
    current = { ignored: ignoreInfo(node, ignoreCache), forced: forceCheck, containers: ignoreContainers(node), component: componentOf.get(node.id) || null };
    const common = { node, ctx, options, family, pageInstances, instanceInfoCache, inIcon: !!iconHost, forceCheck };
    const paintsCanvas = node.type !== "SECTION"; // a section's fill is canvas organisation, not UI

    if (paintsCanvas && "fills" in node && Array.isArray(node.fills)) {
      for (let i = 0; i < node.fills.length; i++) {
        const paint = node.fills[i];
        if (paint.type !== "SOLID") continue;
        let category = "bg";
        let fallbackCategory = null;
        if (isText) category = "text";
        else if (iconHost || isIconNode(node, options.keywords)) {
          category = "icon";
          fallbackCategory = "bg";
        }
        push(await processColorPaint({ ...common, field: "fills", paintIndex: i, paint, category, fallbackCategory }));
      }
    }

    if (paintsCanvas && "strokes" in node && Array.isArray(node.strokes)) {
      for (let i = 0; i < node.strokes.length; i++) {
        const paint = node.strokes[i];
        if (paint.type !== "SOLID") continue;
        // An icon's stroke is its color (outline icons), not a border.
        push(await processColorPaint({ ...common, field: "strokes", paintIndex: i, paint, category: iconHost ? "icon" : "border", fallbackCategory: iconHost ? "bg" : null }));
      }
    }

    if (isText && options.matchText) push(await processTextStyle(common));

    if (options.matchSpacing) for (const e of await processSpacing(node, options)) push(e);
    if (options.matchRadius) for (const e of await processRadius(node, options)) push(e);
  }

  return { plan, scannedNodeCount: scanned.length, truncated };
}

// ---- Apply ------------------------------------------------------------------

const LIBRARY_HINT = "check the gra.UI.ty library is enabled in this file (Assets → Libraries)";
const LIBRARY_TIMEOUT_MS = 20000;
const ITEM_TIMEOUT_MS = 20000;

// A Figma call that never settles must not leave Apply stuck forever.
function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).then(
    (value) => {
      clearTimeout(timer);
      return value;
    },
    (error) => {
      clearTimeout(timer);
      throw error;
    }
  );
}

async function getLibraryVariable(key, name, state) {
  if (state.vars.has(key)) return state.vars.get(key);
  if (state.errors.has(key)) throw new Error(state.errors.get(key));
  let variable = [...variableCache.values()].find((v) => v.key === key) || null; // inside the library file itself
  if (!variable) {
    try {
      variable = await withTimeout(figma.variables.importVariableByKeyAsync(key), LIBRARY_TIMEOUT_MS, "timed out");
    } catch (e) {
      const reason = e.message === "timed out" ? `Loading "${name}" from the library timed out — check your connection and that the library is enabled.` : `Couldn't load "${name}" from the library — ${LIBRARY_HINT}.`;
      state.errors.set(key, reason);
      throw new Error(reason);
    }
  }
  state.vars.set(key, variable);
  return variable;
}

async function getLibraryTextStyle(key, name, state) {
  if (state.styles.has(key)) return state.styles.get(key);
  if (state.errors.has(key)) throw new Error(state.errors.get(key));
  if (!state.localStyles) state.localStyles = await figma.getLocalTextStylesAsync();
  let style = state.localStyles.find((s) => s.key === key) || null;
  if (!style) {
    try {
      style = await withTimeout(figma.importStyleByKeyAsync(key), LIBRARY_TIMEOUT_MS, "timed out");
    } catch (e) {
      const reason = e.message === "timed out" ? `Loading text style "${name}" from the library timed out — check your connection and that the library is enabled.` : `Couldn't load text style "${name}" from the library — ${LIBRARY_HINT}.`;
      state.errors.set(key, reason);
      throw new Error(reason);
    }
  }
  state.styles.set(key, style);
  return style;
}

async function loadFontOrFail(fontName, state) {
  const id = `${fontName.family}|${fontName.style}`;
  if (state.fonts.has(id)) return;
  try {
    await figma.loadFontAsync(fontName);
  } catch (e) {
    throw new Error(`Font "${fontName.family} ${fontName.style}" isn't available on this machine.`);
  }
  state.fonts.add(id);
}

// Load every distinct library token/style the batch needs in parallel up
// front — one-by-one imports are what made big applies look frozen.
async function preloadLibrary(items, state) {
  const vars = new Map();
  const styles = new Map();
  for (const item of items) (item.kind === "textStyle" ? styles : vars).set(item.variableId, item.refTokenName);
  if (styles.size > 0) state.localStyles = await figma.getLocalTextStylesAsync();
  figma.ui.postMessage({ type: "apply-progress", phase: "loading", total: vars.size + styles.size });
  const ignore = () => {}; // failures are recorded in state.errors and reported per row
  await Promise.all([
    ...[...vars].map(([key, name]) => getLibraryVariable(key, name, state).catch(ignore)),
    ...[...styles].map(([key, name]) => getLibraryTextStyle(key, name, state).catch(ignore)),
  ]);
}

async function applyTextStyle(node, item, state) {
  const style = await getLibraryTextStyle(item.variableId, item.refTokenName, state);
  if (node.textStyleId === style.id) return "unchanged";
  await loadFontOrFail(style.fontName, state);
  if (node.fontName !== figma.mixed) await loadFontOrFail(node.fontName, state);
  else for (const seg of node.getStyledTextSegments(["fontName"])) await loadFontOrFail(seg.fontName, state);
  await node.setTextStyleIdAsync(style.id);
  if (node.textStyleId !== style.id) throw new Error(`Text style did not stick on "${node.name}".`);
  return "applied";
}

async function applyPaint(node, item, state) {
  const variable = await getLibraryVariable(item.variableId, item.refTokenName, state);
  const paints = node[item.field].slice();
  const paint = paints[item.paintIndex];
  if (!paint) throw new Error("Paint no longer at expected index");
  const currentId = paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  if (currentId === variable.id) return "unchanged";
  paints[item.paintIndex] = figma.variables.setBoundVariableForPaint(paint, "color", variable);
  node[item.field] = paints;
  // Figma can silently ignore a binding (locked/read-only situations), so
  // read it back instead of trusting the call.
  const after = node[item.field][item.paintIndex];
  const boundId = after && after.boundVariables && after.boundVariables.color && after.boundVariables.color.id;
  if (boundId !== variable.id) {
    throw new Error(`Binding did not persist on "${node.name}" (${item.field}) — the layer may be locked or read-only here.`);
  }
  return "applied";
}

async function applyNumber(node, item, state) {
  const variable = await getLibraryVariable(item.variableId, item.refTokenName, state);
  const fields = item.fields || [];
  if (fields.length === 0) throw new Error("Nothing to bind");
  if (fields.every((f) => readBoundIdForField(node, f) === variable.id)) return "unchanged";
  for (const f of fields) node.setBoundVariable(f, variable);
  // Read each corner/side back individually — a uniform radius is stored per
  // corner, so checking a single "cornerRadius" key would give false failures.
  const missed = fields.filter((f) => readBoundIdForField(node, f) !== variable.id);
  if (missed.length) throw new Error(`Binding did not persist on "${node.name}" (${missed.join(", ")}).`);
  return "applied";
}

async function applyItem(item, state) {
  const node = await figma.getNodeByIdAsync(item.nodeId);
  if (!node || node.removed) throw new Error("Layer no longer exists");
  if (item.kind === "textStyle") return applyTextStyle(node, item, state);
  if (item.kind === "paint") return applyPaint(node, item, state);
  return applyNumber(node, item, state);
}

const yieldToFigma = () => new Promise((resolve) => setTimeout(resolve, 0));

async function applyPlan(items) {
  const results = { applied: 0, unchanged: 0, failed: [] };
  const state = { vars: new Map(), styles: new Map(), errors: new Map(), fonts: new Set(), localStyles: null };
  await preloadLibrary(items, state);

  let lastProgress = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const outcome = await withTimeout(applyItem(item, state), ITEM_TIMEOUT_MS, `Timed out applying "${item.refTokenName}" — skipped.`);
      results[outcome]++;
    } catch (e) {
      results.failed.push({ id: item.id, reason: e.message || String(e) });
    }
    if (Date.now() - lastProgress > 250 || i === items.length - 1) {
      lastProgress = Date.now();
      figma.ui.postMessage({ type: "apply-progress", phase: "applying", done: i + 1, total: items.length });
      await yieldToFigma(); // lets the progress message and canvas actually update
    }
  }
  return results;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "save-prefs") {
    try {
      await figma.clientStorage.setAsync(PREFS_KEY, msg.prefs);
    } catch (e) {
      /* storage full or unavailable — settings just won't persist */
    }
    return;
  }

  if (msg.type === "resize") {
    figma.ui.resize(PANEL_WIDTH, Math.max(360, Math.min(900, Math.round(msg.height))));
    return;
  }

  if (msg.type === "scan") {
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: "scan-result", plan: [], error: "Select at least one frame or layer first." });
      return;
    }
    try {
      const { plan, scannedNodeCount, truncated } = await scan(msg.options);
      figma.ui.postMessage({ type: "scan-result", plan, scannedNodeCount, truncated });
    } catch (e) {
      figma.ui.postMessage({ type: "scan-result", plan: [], error: e.message || String(e) });
    }
    return;
  }

  if (msg.type === "set-override") {
    // One layer, or every layer in a group of similar rows.
    for (const id of msg.nodeIds || [msg.nodeId]) {
      const node = await figma.getNodeByIdAsync(id);
      if (node && !node.removed) node.setPluginData(OVERRIDE_KEY, msg.value || "");
    }
    figma.ui.postMessage({ type: "override-saved" });
    return;
  }

  if (msg.type === "select-node") {
    const error = await selectLayers(msg.nodeIds || [msg.nodeId]);
    if (error) figma.ui.postMessage({ type: "select-error", error });
    return;
  }

  if (msg.type === "apply") {
    try {
      const results = await applyPlan(msg.items);
      figma.ui.postMessage({ type: "apply-result", results });
    } catch (e) {
      figma.ui.postMessage({ type: "apply-result", results: { applied: 0, unchanged: 0, failed: [] }, error: e.message || String(e) });
    }
  }
};
