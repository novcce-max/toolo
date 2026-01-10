import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: 'PDF 旋转工具在线 - 页面方向旋转90/180（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 旋转工具：在浏览器本地将 PDF 页面旋转 90/180/270 度，支持全部页面或指定页码范围旋转，不上传服务器，适合修正扫描件方向与统一阅读体验。',
  alternates: { canonical: 'https://toolo.cn/pdf/rotate' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/rotate',
    title: 'PDF 旋转工具在线 - 页面方向旋转90/180（本地处理不上传）- toolo.cn',
    description:
      'PDF 页面旋转工具：本地处理、不上传，支持 90/180/270 度旋转和指定页码范围，适合修正扫描件和提交前统一页面方向。',
    siteName: 'toolo.cn',
  },
}

export default function PdfRotatePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'PDF 旋转工具',
        url: 'https://toolo.cn/pdf/rotate',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 旋转工具：在浏览器本地将 PDF 页面旋转 90/180/270 度，支持全部页面或指定页码范围旋转，不上传服务器，适合修正扫描件方向与统一阅读体验。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: [
          '本地旋转单个 PDF 文件',
          '支持 90/180/270 度旋转',
          '支持全部页面或按页码范围旋转',
          '显示处理页数并生成可下载 PDF',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用 PDF 旋转工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件会在浏览器本地被读取和旋转，不会上传到服务器或被云端保存，旋转完成后只会以你下载到本地的新 PDF 文件形式存在。',
            },
          },
          {
            '@type': 'Question',
            name: '如何只旋转 PDF 中的部分页面？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '你可以在“指定页码范围”中输入类似“1,3,5-8”的规则，其中 1 表示第 1 页，3 表示第 3 页，5-8 表示第 5 到第 8 页。工具会只对这些页应用所选角度，其他页面保持不变。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 旋转"
      description="在浏览器本地旋转 PDF 页面方向，支持全部页面或指定页码范围，默认不上传服务器。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>扫描件方向不对，需要整体或部分页面旋转后再阅读或打印。</li>
              <li>只想旋转某几页（例如签字页），避免影响整份文档结构。</li>
              <li>提交前统一 PDF 页面方向，提高阅读体验与专业度。</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器本地旋转 PDF 页面，不上传服务器、不需登录，适合处理包含隐私内容的合同、报告和证明材料。详情请查看{' '}
              <Link
                href="/privacy"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                /privacy
              </Link>
              。
            </p>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-5">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">本地处理</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">不上传</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">免费使用</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">PDF 旋转工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地将 PDF 页面旋转 90/180/270 度，支持对全部页面或指定页码范围进行旋转，不上传服务器，适合修正扫描件方向与提交前统一版式。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-rotate-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            上传 PDF 开始旋转
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            所有旋转操作在浏览器本地完成，不上传文件，适合处理敏感文档。
          </div>
        </div>
      </section>
      <section
        id="pdf-rotate-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">旋转流程</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤一：上传 PDF 文件</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              选择需要旋转的 PDF 文件，文件会在浏览器本地读取，不会上传到服务器。适合旋转扫描件、合同或报告等文档。
            </p>
            <div
              id="pdf-rotate-dropzone"
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3"
            >
              <label
                htmlFor="pdf-rotate-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
              >
                <span
                  id="pdf-rotate-input-label"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  选择要旋转的 PDF 文件
                </span>
                <span className="text-xs text-slate-500">支持拖拽 PDF 到此区域，文件仅在本地处理。</span>
              </label>
              <input id="pdf-rotate-input" type="file" accept="application/pdf" className="hidden" />
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  原始文件：
                  <span id="pdf-rotate-file-name" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
                <div>
                  原始大小：
                  <span id="pdf-rotate-file-size" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
                <div>
                  原始页数：
                  <span id="pdf-rotate-page-count" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤二：选择旋转角度与范围</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              先选择旋转角度，再选择作用范围是全部页面还是指定页码范围。页码从 1 开始计数。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-4">
              <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-slate-900">旋转角度</legend>
                <div className="space-y-1 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pdf-rotate-angle"
                      value="90"
                      defaultChecked
                      className="h-3 w-3"
                    />
                    <span>顺时针 90°</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pdf-rotate-angle" value="180" className="h-3 w-3" />
                    <span>旋转 180°</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pdf-rotate-angle" value="270" className="h-3 w-3" />
                    <span>顺时针 270°（等同逆时针 90°）</span>
                  </label>
                </div>
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-slate-900">作用范围</legend>
                <div className="space-y-1 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pdf-rotate-scope"
                      value="all"
                      defaultChecked
                      className="h-3 w-3"
                    />
                    <span>全部页面</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pdf-rotate-scope" value="range" className="h-3 w-3" />
                    <span>指定页码范围</span>
                  </label>
                </div>
              </fieldset>
              <div className="space-y-2">
                <label htmlFor="pdf-rotate-ranges" className="text-xs font-medium text-slate-900">
                  指定页码范围（仅在选择“指定页码范围”时生效）
                </label>
                <input
                  id="pdf-rotate-ranges"
                  type="text"
                  inputMode="numeric"
                  placeholder="例如：1,3,5-8"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  使用规则：用逗号分隔多个片段，每个片段可以是单页（如 3）或范围（如 5-8）。页码必须为大于等于 1 的整数，且不大于文档总页数。
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤三：旋转并下载</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              设置完成后，点击“开始旋转”，在浏览器本地完成处理。旋转成功后可以下载新的 PDF 文件，并查看实际处理的页数。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
              <div className="flex items-baseline justify-between text-xs text-slate-700">
                <span>处理页数</span>
                <span id="pdf-rotate-processed-count">—</span>
              </div>
              <button
                type="button"
                id="pdf-rotate-button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                开始旋转
              </button>
              <a
                id="pdf-rotate-download"
                href="#"
                download
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-40 pointer-events-none"
              >
                下载旋转后的 PDF
              </a>
              <div id="pdf-rotate-status" className="text-xs text-slate-500">
                上传 PDF 并设置好角度与范围后，点击“开始旋转”即可在浏览器本地完成处理并下载。
              </div>
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var input = document.getElementById('pdf-rotate-input');
  var labelEl = document.getElementById('pdf-rotate-input-label');
  var dropzone = document.getElementById('pdf-rotate-dropzone');
  var nameEl = document.getElementById('pdf-rotate-file-name');
  var sizeEl = document.getElementById('pdf-rotate-file-size');
  var pageCountEl = document.getElementById('pdf-rotate-page-count');
  var rangesInput = document.getElementById('pdf-rotate-ranges');
  var rotateButton = document.getElementById('pdf-rotate-button');
  var downloadLink = document.getElementById('pdf-rotate-download');
  var processedCountEl = document.getElementById('pdf-rotate-processed-count');
  var statusEl = document.getElementById('pdf-rotate-status');
  if (!input || !dropzone || !nameEl || !sizeEl || !pageCountEl || !rangesInput || !rotateButton || !downloadLink || !processedCountEl || !statusEl) return;

  var originalBytes = null;
  var originalPageCount = null;
  var objectUrl = null;

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    var mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }

  function cleanupUrl() {
    if (objectUrl) {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch (e) {}
      objectUrl = null;
    }
  }

  function resetState() {
    originalBytes = null;
    originalPageCount = null;
    nameEl.textContent = '—';
    sizeEl.textContent = '—';
    pageCountEl.textContent = '—';
    processedCountEl.textContent = '—';
    cleanupUrl();
    downloadLink.classList.add('opacity-40');
    downloadLink.classList.add('pointer-events-none');
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');
    if (labelEl) {
      labelEl.textContent = '选择要旋转的 PDF 文件';
    }
  }

  function handleFile(file) {
    cleanupUrl();
    processedCountEl.textContent = '—';
    originalBytes = null;
    originalPageCount = null;

    if (!file) {
      resetState();
      statusEl.textContent = '请选择需要旋转的 PDF 文件。';
      return;
    }

    if (file.type !== 'application/pdf') {
      resetState();
      statusEl.textContent = '文件格式错误，请选择 PDF 文件。';
      return;
    }

    nameEl.textContent = file.name || '未命名.pdf';
    sizeEl.textContent = formatSize(file.size);
    pageCountEl.textContent = '读取中…';
    statusEl.textContent = '正在本地读取 PDF 页面信息，请稍候…';
    if (labelEl) {
      labelEl.textContent = '已选择：' + (file.name || 'PDF 文件') + '（点击重新选择）';
    }

    if (!window.PDFLib) {
      statusEl.textContent = 'PDF 处理库加载中，请稍后重试。';
      resetState();
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var result = reader.result;
      if (!(result instanceof ArrayBuffer)) {
        statusEl.textContent = '读取 PDF 文件失败，请重试。';
        resetState();
        return;
      }
      originalBytes = new Uint8Array(result);
      var PDFLib = window.PDFLib;
      (async function () {
        try {
          var pdfDoc = await PDFLib.PDFDocument.load(originalBytes, { ignoreEncryption: true });
          originalPageCount = pdfDoc.getPageCount();
          pageCountEl.textContent = String(originalPageCount);
          statusEl.textContent = '已读取 PDF，共 ' + originalPageCount + ' 页。请选择旋转角度与范围。';
        } catch (e) {
          statusEl.textContent = '解析 PDF 文件失败，请检查文件是否损坏。';
          resetState();
        }
      })();
    };
    reader.onerror = function () {
      statusEl.textContent = '读取 PDF 文件失败，请重试。';
      resetState();
    };
    reader.readAsArrayBuffer(file);
  }

  // 确保 input 元素在页面加载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  if (input) {
    input.value = '';
  }

  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    handleFile(file || null);
  });

  dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.classList.add('ring-2', 'ring-slate-300');
  });

  dropzone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropzone.classList.remove('ring-2', 'ring-slate-300');
  });

  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('ring-2', 'ring-slate-300');
    var dt = e.dataTransfer;
    var file = dt && dt.files && dt.files[0];
    if (file) {
      handleFile(file);
    } else {
      statusEl.textContent = '请拖拽单个 PDF 文件到此区域。';
    }
  });

  function getSelectedAngle() {
    var radios = document.querySelectorAll('input[name="pdf-rotate-angle"]');
    var value = '90';
    radios.forEach(function (r) {
      if (r.checked) value = r.value;
    });
    var angle = parseInt(value, 10);
    if (angle !== 90 && angle !== 180 && angle !== 270) angle = 90;
    return angle;
  }

  function getScopeMode() {
    var radios = document.querySelectorAll('input[name="pdf-rotate-scope"]');
    var value = 'all';
    radios.forEach(function (r) {
      if (r.checked) value = r.value;
    });
    return value === 'range' ? 'range' : 'all';
  }

  function parseRanges(text, maxPage) {
    var raw = (text || '').replace(/\\s+/g, '');
    if (!raw) return [];
    var parts = raw.split(',');
    var indices = new Set();
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part) continue;
      if (part.indexOf('-') !== -1) {
        var seg = part.split('-');
        if (seg.length !== 2) continue;
        var start = parseInt(seg[0], 10);
        var end = parseInt(seg[1], 10);
        if (!start || !end || start < 1 || end < 1) continue;
        if (start > end) {
          var tmp = start;
          start = end;
          end = tmp;
        }
        if (maxPage && start > maxPage) continue;
        if (maxPage && end > maxPage) end = maxPage;
        for (var p = start; p <= end; p++) {
          indices.add(p - 1);
        }
      } else {
        var num = parseInt(part, 10);
        if (!num || num < 1) continue;
        if (maxPage && num > maxPage) continue;
        indices.add(num - 1);
      }
    }
    return Array.from(indices).sort(function (a, b) {
      return a - b;
    });
  }

  rotateButton.addEventListener('click', function () {
    if (!window.PDFLib) {
      statusEl.textContent = 'PDF 处理库加载中，请稍后重试。';
      return;
    }
    if (!originalBytes || !originalPageCount) {
      statusEl.textContent = '请先上传需要旋转的 PDF 文件。';
      return;
    }

    var angle = getSelectedAngle();
    var mode = getScopeMode();
    var targetIndices;

    if (mode === 'range') {
      var rangesText = rangesInput.value;
      var indices = parseRanges(rangesText, originalPageCount);
      if (!indices.length) {
        statusEl.textContent = '页码范围无效，请检查格式，例如：1,3,5-8，并确认不超过总页数。';
        return;
      }
      targetIndices = indices;
    } else {
      targetIndices = [];
      for (var i = 0; i < originalPageCount; i++) {
        targetIndices.push(i);
      }
    }

    if (!targetIndices.length) {
      statusEl.textContent = '未找到需要旋转的页面，请检查设置。';
      return;
    }

    statusEl.textContent = '正在本地旋转 PDF 页面，请稍候…';
    rotateButton.disabled = true;
    cleanupUrl();
    processedCountEl.textContent = '—';
    downloadLink.classList.add('opacity-40');
    downloadLink.classList.add('pointer-events-none');
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');

    var PDFLib = window.PDFLib;

    (async function () {
      try {
        var pdfDoc = await PDFLib.PDFDocument.load(originalBytes, { ignoreEncryption: true });
        var pages = pdfDoc.getPages();
        var rotatedCount = 0;
        var delta = angle;

        for (var i = 0; i < pages.length; i++) {
          if (targetIndices.indexOf(i) === -1) continue;
          var page = pages[i];
          var rotation = page.getRotation();
          var currentAngle = rotation && typeof rotation.angle === 'number' ? rotation.angle : 0;
          var nextAngle = (currentAngle + delta) % 360;
          page.setRotation(PDFLib.degrees(nextAngle));
          rotatedCount++;
        }

        var rotatedBytes = await pdfDoc.save({ useObjectStreams: true });
        var blob = new Blob([rotatedBytes], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);

        var defaultName = nameEl.textContent && nameEl.textContent !== '—' ? nameEl.textContent : 'rotated.pdf';
        var base = defaultName.toLowerCase().endsWith('.pdf')
          ? defaultName.slice(0, -4)
          : defaultName;

        downloadLink.href = objectUrl;
        downloadLink.download = base + '.rotated.pdf';
        downloadLink.classList.remove('opacity-40');
        downloadLink.classList.remove('pointer-events-none');

        processedCountEl.textContent = String(rotatedCount);
        statusEl.textContent =
          '旋转完成，共处理 ' + rotatedCount + ' 页。可以点击“下载旋转后的 PDF”保存到本地。';
      } catch (e) {
        statusEl.textContent = '旋转过程中出现错误，请检查文件是否损坏，或减少页数后重试。';
        cleanupUrl();
        processedCountEl.textContent = '—';
        downloadLink.classList.add('opacity-40');
        downloadLink.classList.add('pointer-events-none');
        downloadLink.removeAttribute('href');
        downloadLink.removeAttribute('download');
      } finally {
        rotateButton.disabled = false;
      }
    })();
  });

  window.addEventListener('beforeunload', function () {
    cleanupUrl();
  });
})();
          `.trim(),
          }}
        />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用 PDF 旋转工具时，文件会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件会在浏览器本地被读取和旋转，不会上传到服务器或被云端保存，旋转后的结果只会以你下载到本地的新 PDF 文件形式存在。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何只旋转其中几页？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择“指定页码范围”，再在输入框中填入类似“1,3,5-8”的范围即可。页码从 1 开始计数，你可以组合多个单页和区间，工具会只对这些页面应用旋转角度。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="在浏览器本地压缩 PDF 体积，适合邮件发送与平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="将多个 PDF 在浏览器本地按顺序合并为一个文件，适合资料整理与归档。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/split"
            title="PDF 拆分"
            description="按页码范围拆分 PDF，在浏览器本地处理不上传，适合同一文档按章节或材料拆分提交。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}