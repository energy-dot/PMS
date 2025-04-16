  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchProjects();
      return;
    }

    // クライアントサイドフィルタリング（本来はAPIでの検索が望ましい）
    const filteredProjects = projects.filter(
      project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.department?.name &&
          project.department.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.section?.name &&
          project.section.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setProjects(filteredProjects);
  };

  // 新規登録画面へ遷移
  const handleCreateProject = () => {
    // 編集モードの時は確認ダイアログ
    if (isEditable) {
      if (window.confirm('編集モードを終了して新規登録しますか？')) {
        setIsEditable(false);
        handleAddNewRow();
      }
    } else {
      // 編集モードを有効にして新規行を追加
      setIsEditable(true);
      setTimeout(() => {
        handleAddNewRow();
      }, 100);
    }
  };

  // グリッドに新規行を追加
  const handleAddNewRow = () => {
    // 現在の日付
    const today = new Date();
    // 3ヶ月後の日付
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    // 新規案件データの作成
    const newProject: any = {
      id: `new-${Date.now()}`,
      name: '新規案件',
      departmentId: null,
      sectionId: null,
      startDate: today,
      endDate: threeMonthsLater,
      status: '承認待ち',
      isRemote: false,
      isNew: true, // 新規行フラグ
    };

    // 新規行を追加
    setProjects(prev => [newProject, ...prev]);
  };

  // 詳細画面へ遷移
  const handleViewProject = (id: string) => {
    // 編集モードの時は遷移させない（DataGridコンポーネントの変更で対応済み）
    navigate(`/projects/${id}`);
  };

  // 削除処理
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('この案件を削除してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      await projectService.deleteProject(id);
      // 削除後、リストを更新
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
    } catch (err: any) {
      setError(err.response?.data?.message || '削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  // セル編集時の処理
  const handleCellValueChanged = async (params: any) => {
    // 一括保存の場合
    if (params.type === 'saveAll') {
      setIsLoading(true);
      try {
        const promises = params.modifiedRows.map((row: Project) => {
          const updateData: UpdateProjectDto = { ...row };

          // データクリーニング