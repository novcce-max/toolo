import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: '在线 PDF 拆分工具 - 按页拆分/提取页面（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 拆分工具：在浏览器本地按页码范围拆分 PDF，支持输入 1-3,5,8-10 这样的范围，split pdf pages without upload，适合按章节提交、拆分附件与资料分发，保护隐私。',
  alternates: { canonical: 'https://toolo.cn/pdf/split' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/split',
    title: '在线 PDF 拆分工具 - 按页拆分/提取页面（本地处理不上传）- toolo.cn',
    description:
      'PDF 拆分工具：在浏览器本地根据页码范围拆分单个 PDF 为多个文件，支持多段范围输入和逐个下载拆分结果，不上传文件，适合办公与学习场景。',
    siteName: 'toolo.cn',
  },
}

export default function PdfSplitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '在线 PDF 拆分工具',
        url: 'https://toolo.cn/pdf/split',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 拆分工具：在浏览器本地根据页码范围拆分单个 PDF 文件，支持输入 1-3,5,8-10 等多段范围，生成多个子 PDF 文件并逐个下载，不上传服务器，适合按章节提交与资料分发。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: [
          '本地拆分单个 PDF 文件',
          '支持输入多段页码范围',
          '生成多个拆分后的 PDF 文件',
          '显示原始页数与拆分结果数量',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用这个 PDF 拆分工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件会在浏览器本地读取和拆分，不会上传到服务器或被云端保存，拆分完成后只会生成多个你可以下载的子 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '如何正确填写 PDF 拆分的页码范围？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '页码范围支持用逗号分隔的多段规则，例如“1-3,5,8-10”。其中 1-3 表示第 1 到第 3 页，5 表示单独第 5 页，8-10 表示第 8 到第 10 页。页码从 1 开始计数，不要输入小数或 0。',
            },
          },
          {
            '@type': 'Question',
            name: '拆分后的 PDF 会影响原文件清晰度或内容吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '拆分操作以“按页拆出子文档”为主，不对页面内容做压缩或重采样，一般不会改变页面清晰度和内容。原始 PDF 文件不会被修改，只是根据你选择的范围生成新的子 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '一次可以拆分多少个页码范围？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '理论上可以输入多段页码范围，工具本身不额外限制，实际受限于浏览器和设备性能。若拆分范围过多或原文件过大，可能会变慢，建议按章节或需求合理拆分。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 拆分"
      description="在浏览器本地按页码范围拆分单个 PDF 文件，不上传服务器，适合同一文档分章节提交或提取部分页面。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器本地拆分 PDF，不上传服务器、不需登录，适合处理合同、证明、报告等隐私文档。详情请查看{' '}
              <Link
                href="/privacy"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                /privacy
              </Link>
              。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>将一份长文档按章节拆分成多份 PDF，分别提交或分发。</li>
              <li>从报告或合同中只提取部分页面，用于补充材料或说明。</li>
              <li>对包含多个子文档的扫描 PDF，按页码拆出独立文件保存。</li>
              <li>教学或培训资料按章节拆分，方便按课次分享给学员。</li>
            </ul>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-5">
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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">在线 PDF 拆分工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地根据页码范围拆分单个 PDF 文件，不上传服务器，适合同一文档分章节提交、提取部分页面或按需求拆分材料，兼顾隐私安全与使用灵活性。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-split-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            上传 PDF 开始拆分
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            仅支持单个 PDF 文件拆分，所有处理在浏览器本地完成，不上传文件。
          </div>
        </div>
      </section>
      <section
        id="pdf-split-tool"
        className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">拆分流程</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤一：上传单个 PDF 文件</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              选择需要拆分的 PDF 文件，文件会在浏览器本地读取，不会上传到服务器。建议文件页数和大小适中，以保证拆分过程顺畅。
            </p>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3">
              <label
                htmlFor="pdf-split-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
              >
                <span className="text-sm font-medium text-slate-900">点击选择要拆分的 PDF 文件</span>
                <span className="text-xs text-slate-500">一次仅支持一个 PDF 文件，用于按页拆分。</span>
              </label>
              <input id="pdf-split-input" type="file" accept="application/pdf" className="hidden" />
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  原始文件：
                  <span id="pdf-split-file-name" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
                <div>
                  原始大小：
                  <span id="pdf-split-file-size" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
                <div>
                  原始页数：
                  <span id="pdf-split-page-count" className="font-medium text-slate-900">
                    —
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤二：输入拆分页码范围</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              通过页码范围指定要拆分出的部分，支持多个范围组合，例如：1-3,5,8-10。页码从 1 开始计数。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
              <label htmlFor="pdf-split-ranges" className="text-xs font-medium text-slate-900">
                页码范围
              </label>
              <input
                id="pdf-split-ranges"
                type="text"
                inputMode="numeric"
                placeholder="例如：1-3,5,8-10"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <div className="text-[11px] text-slate-500 leading-relaxed">
                使用规则：用逗号分隔多个片段，每个片段可以是单页（如 5）或范围（如 2-6）。页码必须是大于等于 1 的整数，不要包含 0 或负数。
              </div>
              <button
                type="button"
                id="pdf-split-button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                按范围拆分 PDF
              </button>
              <div id="pdf-split-status" className="text-xs text-slate-500">
                上传 PDF 并填写正确的页码范围后，点击“按范围拆分 PDF”即可在本地生成多个子文档。
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤三：下载拆分结果</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              拆分完成后，会生成多个子 PDF 文件，文件名会带上对应的页码范围。你可以逐个点击下载，也可以按需要选择其中的一部分保存。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
              <div className="flex items-baseline justify-between text-xs text-slate-700">
                <span>拆分结果数量</span>
                <span id="pdf-split-result-count">0</span>
              </div>
              <ul id="pdf-split-result-list" className="space-y-2 text-xs text-slate-700" />
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var input = document.getElementById('pdf-split-input');
  var nameEl = document.getElementById('pdf-split-file-name');
  var sizeEl = document.getElementById('pdf-split-file-size');
  var pageCountEl = document.getElementById('pdf-split-page-count');
  var rangesInput = document.getElementById('pdf-split-ranges');
  var button = document.getElementById('pdf-split-button');
  var statusEl = document.getElementById('pdf-split-status');
  var resultCountEl = document.getElementById('pdf-split-result-count');
  var resultListEl = document.getElementById('pdf-split-result-list');
  if (!input || !nameEl || !sizeEl || !pageCountEl || !rangesInput || !button || !statusEl || !resultCountEl || !resultListEl) return;

  var originalBytes = null;
  var originalPageCount = null;
  var urls = [];

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    var mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }

  function cleanupUrls() {
    urls.forEach(function (u) {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    urls = [];
  }

  function resetState() {
    originalBytes = null;
    originalPageCount = null;
    nameEl.textContent = '—';
    sizeEl.textContent = '—';
    pageCountEl.textContent = '—';
    resultCountEl.textContent = '0';
    resultListEl.innerHTML = '';
    cleanupUrls();
  }

  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    cleanupUrls();
    resultListEl.innerHTML = '';
    resultCountEl.textContent = '0';
    originalBytes = null;
    originalPageCount = null;

    if (!file) {
      resetState();
      statusEl.textContent = '请选择需要拆分的 PDF 文件。';
      return;
    }

    nameEl.textContent = file.name;
    sizeEl.textContent = formatSize(file.size);
    pageCountEl.textContent = '读取中…';
    statusEl.textContent = '正在本地读取 PDF 页面信息，请稍候…';

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
          statusEl.textContent = '已读取 PDF，共 ' + originalPageCount + ' 页。请输入要拆分的页码范围。';
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
  });

  function parseRanges(text, maxPage) {
    var raw = (text || '').replace(/\\s+/g, '');
    if (!raw) return [];
    var parts = raw.split(',');
    var ranges = [];
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
        ranges.push({ start: start, end: end });
      } else {
        var p = parseInt(part, 10);
        if (!p || p < 1) continue;
        if (maxPage && p > maxPage) continue;
        ranges.push({ start: p, end: p });
      }
    }
    return ranges;
  }

  button.addEventListener('click', function () {
    if (!window.PDFLib) {
      statusEl.textContent = 'PDF 处理库加载中，请稍后重试。';
      return;
    }
    if (!originalBytes || !originalPageCount) {
      statusEl.textContent = '请先上传需要拆分的 PDF 文件。';
      return;
    }
    var text = rangesInput.value;
    var ranges = parseRanges(text, originalPageCount);
    if (!ranges.length) {
      statusEl.textContent = '页码范围无效，请检查格式，例如：1-3,5,8-10。';
      return;
    }

    statusEl.textContent = '正在本地按页码范围拆分 PDF，请稍候…';
    button.disabled = true;
    cleanupUrls();
    resultListEl.innerHTML = '';
    resultCountEl.textContent = '0';

    var PDFLib = window.PDFLib;

    (async function () {
      try {
        var srcDoc = await PDFLib.PDFDocument.load(originalBytes, { ignoreEncryption: true });
        var totalResults = 0;

        for (var i = 0; i < ranges.length; i++) {
          var range = ranges[i];
          var startIndex = range.start - 1;
          var endIndex = range.end - 1;
          if (startIndex < 0) startIndex = 0;
          if (endIndex >= originalPageCount) endIndex = originalPageCount - 1;
          if (startIndex > endIndex) continue;

          var newDoc = await PDFLib.PDFDocument.create();
          var indices = [];
          for (var p = startIndex; p <= endIndex; p++) {
            indices.push(p);
          }
          var copied = await newDoc.copyPages(srcDoc, indices);
          copied.forEach(function (page) {
            newDoc.addPage(page);
          });
          var bytes = await newDoc.save({ useObjectStreams: true });
          var size = bytes.length;
          var blob = new Blob([bytes], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          urls.push(url);
          totalResults++;

          var li = document.createElement('li');
          li.className =
            'flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2';
          var left = document.createElement('div');
          left.className = 'flex-1 min-w-0';
          var title = document.createElement('div');
          title.className = 'truncate font-medium text-slate-900';
          title.textContent = '页码范围：' + range.start + (range.start === range.end ? '' : '-' + range.end);
          var info = document.createElement('div');
          info.className = 'text-[11px] text-slate-500';
          info.textContent = '大小：' + formatSize(size);
          left.appendChild(title);
          left.appendChild(info);

          var right = document.createElement('div');
          right.className = 'flex items-center gap-2';
          var a = document.createElement('a');
          a.href = url;
          a.download = 'split-' + range.start + (range.start === range.end ? '' : '-' + range.end) + '.pdf';
          a.textContent = '下载';
          a.className =
            'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50';
          right.appendChild(a);

          li.appendChild(left);
          li.appendChild(right);
          resultListEl.appendChild(li);
        }

        resultCountEl.textContent = String(totalResults);
        if (totalResults === 0) {
          statusEl.textContent = '未能根据当前页码范围拆分出有效子文档，请检查范围设置。';
        } else {
          statusEl.textContent = '拆分完成，共生成 ' + totalResults + ' 个子 PDF 文件，可以逐个下载。';
        }
      } catch (e) {
        statusEl.textContent = '拆分过程中出现错误，可以尝试缩小范围或重新上传文件。';
        cleanupUrls();
        resultListEl.innerHTML = '';
        resultCountEl.textContent = '0';
      } finally {
        button.disabled = false;
      }
    })();
  });

  window.addEventListener('beforeunload', function () {
    cleanupUrls();
  });
})();
          `.trim(),
          }}
        />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用这个 PDF 拆分工具时，文件会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件会在浏览器本地读取和拆分，不会上传到服务器或被云端保存，拆分完成后只会生成多个你可以下载的子 PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何正确填写 PDF 拆分的页码范围？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              页码范围支持用逗号分隔的多段规则，例如“1-3,5,8-10”。其中 1-3 表示第 1 到第 3 页，5 表示单独第 5 页，8-10 表示第 8 到第 10 页。页码从 1
              开始计数，不要输入 0、负数或非数字字符。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">拆分后的 PDF 会影响原文件清晰度或内容吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              拆分操作以“按页拆出子文档”为主，不对页面内容做压缩或重采样，一般不会改变页面清晰度和内容。原始 PDF 文件不会被修改，只是根据你选择的范围生成新的子
              PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">一次可以输入多少个页码范围？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              工具本身不额外限制范围数量，实际受限于浏览器和设备性能。若范围过多或原文件页数很大，拆分时间会明显增加，建议按章节或需求分批拆分，以获得更稳定的体验。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关 PDF 工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="在浏览器本地将多个 PDF 按顺序合并为一个文件，适合资料整理与统一提交。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="本地压缩 PDF 文件体积，适合邮件发送与平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/images-to-pdf"
            title="图片转 PDF"
            description="将多张图片合并为一个 PDF 文件，适合作业、票据与扫描件整理。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}